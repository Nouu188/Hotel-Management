import handleError from "@/lib/handlers/error";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { parseISO } from 'date-fns';
// Đảm bảo type này được import đúng và có trường availabilityStatus, originalQuantity, quantity (là remaining)
import { HotelBranchRoomTypeItemWithStatus } from "@/types/roomType";

interface GuestAllocationItem {
  adults: number;
  children: number;
  infants: number;
}

interface RequestBody {
  guestAllocations: GuestAllocationItem[];
  branchName: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const { guestAllocations, branchName, dateRange } = body;

    if (!guestAllocations || !branchName || !dateRange?.from || !dateRange?.to) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (guestAllocations, branchName, dateRange with from/to)." },
        { status: 400 }
      );
    }

    const fromDateRequest = parseISO(dateRange.from);
    const toDateRequest = parseISO(dateRange.to);

    if (isNaN(fromDateRequest.getTime()) || isNaN(toDateRequest.getTime()) || fromDateRequest >= toDateRequest) {
        return NextResponse.json(
            { success: false, message: "Invalid date range." },
            { status: 400 }
        );
    }

    const totalGuestPerRoomRequest = guestAllocations.map(
      (item: GuestAllocationItem) => item.adults + item.children + item.infants
    );

    const minCapacityNeeded = totalGuestPerRoomRequest.length > 0 ? Math.min(...totalGuestPerRoomRequest) : 0;
    if (totalGuestPerRoomRequest.length === 0 && minCapacityNeeded <=0) { // Sửa điều kiện: nếu không có guest, minCapacityNeeded sẽ là Infinity
        return NextResponse.json(
            { success: false, message: "Invalid guest allocations." },
            { status: 400 }
        );
    }


    const candidateHotelBranchRoomTypes = await prisma.hotelBranchRoomType.findMany({
      where: {
        hotelBranch: {
          name: branchName,
        },
        roomType: {
          capacity: {
            gte: minCapacityNeeded > 0 ? minCapacityNeeded : 0,
          },
        },
      },
      include: {
        roomType: true,
        hotelBranch: true,
        bookingItems: {
          where: {
            booking: {
              AND: [
                { fromDate: { lt: toDateRequest } },
                { toDate: { gt: fromDateRequest } },
              ],
            },
          },
          include: {
            booking: true,
          },
        },
      },
    });

    const roomProcessingPromises = candidateHotelBranchRoomTypes.map(async (hbrt) => { 
      let totalBookedInPeriod = 0;
      hbrt.bookingItems.forEach(bookingItem => {
        const bookingStartDate = bookingItem.booking.fromDate;
        const bookingEndDate = bookingItem.booking.toDate;
        
        if (bookingStartDate < toDateRequest && bookingEndDate > fromDateRequest) {
          totalBookedInPeriod += bookingItem.quantityBooked;
        }
      });

      const remainingQuantity = hbrt.quantity - totalBookedInPeriod;
      const actualRemainingQuantity = remainingQuantity > 0 ? remainingQuantity : 0;

      let availabilityStatus: "available" | 'sold_out' | "limited" = "sold_out";
      if(actualRemainingQuantity > 0) {
        availabilityStatus = actualRemainingQuantity < 5 ? "limited" : "available";
      }
      
      const roomTypeItem: HotelBranchRoomTypeItemWithStatus = {
        ...hbrt,
        remainingQuantity: actualRemainingQuantity, 
        availabilityStatus: availabilityStatus,
      };
      return roomTypeItem;
    });

    const allProcessedRooms = await Promise.all(roomProcessingPromises);

    // Lọc những phòng phù hợp với ÍT NHẤT MỘT yêu cầu guestCount từ client
    const suitableRooms = allProcessedRooms.filter(room =>
      totalGuestPerRoomRequest.some(guestCount => room.roomType.capacity >= guestCount)
    );
    
    const uniqueRoomsMap = new Map<string, HotelBranchRoomTypeItemWithStatus>(); // Sửa type của Map
    suitableRooms.forEach(room => {
      if (!uniqueRoomsMap.has(room.id)) {
        uniqueRoomsMap.set(room.id, room);
      }
    });
    let uniqueSuitableRooms = Array.from(uniqueRoomsMap.values());

    const statusPriority = {
      'limited': 1,
      'available': 2,
      'sold_out': 3
    };

    uniqueSuitableRooms.sort((a, b) => {
      const priorityA = statusPriority[a.availabilityStatus];
      const priorityB = statusPriority[b.availabilityStatus];
      return priorityA - priorityB;
    });

    return NextResponse.json(
      { success: true, data: uniqueSuitableRooms }, 
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}