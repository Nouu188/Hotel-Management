import handleError from "@/lib/handlers/error";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { parseISO } from 'date-fns';
// Đảm bảo type này được import đúng và có trường availabilityStatus, originalQuantity, quantity (là remaining)
import { HotelBranchRoomTypeItemWithStatus } from "@/types/roomType";
import { RoomSearchSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
// --- BƯỚC 1: VALIDATE & TRÍCH XUẤT YÊU CẦU ---
    const body = await request.json();
    const validation = RoomSearchSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: "Invalid input.", errors: validation.error.flatten() }, { status: 400 });
    }

    const { guestAllocations, branchName, dateRange } = validation.data;
    const fromDate = parseISO(dateRange.from);
    const toDate = parseISO(dateRange.to);

    // Tính toán các yêu cầu về sức chứa và số lượng phòng
    const requiredCapacities = guestAllocations.map(g => g.adults + g.children); // Trẻ sơ sinh không tính vào capacity
    const totalRoomsRequested = guestAllocations.length;
    const maxCapacityNeeded = Math.max(...requiredCapacities);

// --- BƯỚC 2: TÌM CÁC LOẠI PHÒNG ỨNG VIÊN ---
    // Tìm tất cả các loại phòng tại chi nhánh có sức chứa đủ cho nhóm đông nhất
    const candidateRoomTypes = await prisma.hotelBranchRoomType.findMany({
      where: {
        hotelBranch: { name: branchName },
        roomType: { capacity: { gte: maxCapacityNeeded }},
        status: "AVAILABLE"
      },
      include: {
        roomType: true,
        hotelBranch: true,
      }
    });

    if (candidateRoomTypes.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

// --- BƯỚC 3: KIỂM TRA KHO PHÒNG THEO NGÀY CHO TỪNG ỨNG VIÊN ---
    const roomProcessingPromises = candidateRoomTypes.map(async (hbrt) => {
      const availabilityResult = await prisma.roomAvailability.aggregate({
        where: {
          hotelBranchRoomTypeId: hbrt.id,
          date: { gte: fromDate, lt: toDate },
        },
        _max: { bookedRooms: true },
        _count: { date: true },
      });
      
      const numberOfNights = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24));
  
      let availableQuantity = 0;
  
      if(availabilityResult._count.date === numberOfNights) {
        const maxBooked = availabilityResult._max.bookedRooms ?? 0;
        availableQuantity = hbrt.quantity - maxBooked;
      }

      // Xác định trạng thái phòng
      let availabilityStatus: "available" | 'sold_out' | "limited" = "sold_out";
      if(availableQuantity > 0) {
        availabilityStatus = availableQuantity < 5 ? "limited" : "available";
      }

      const roomTypeItem: HotelBranchRoomTypeItemWithStatus = {
        ...hbrt,
        hotelBranch: hbrt.hotelBranch, 
        remainingQuantity: availableQuantity, 
        availabilityStatus: availabilityStatus,
      };
      return roomTypeItem;
    });

      const allProcessedRooms = await Promise.all(roomProcessingPromises);
      const availableRooms = allProcessedRooms.filter(room => room.quantity > 0);

      // Kiểm tra xem tổng số phòng còn trống có đủ cho yêu cầu không
      const totalAvailableRooms = availableRooms.reduce((sum, room) => sum + room.quantity, 0);
      if (totalAvailableRooms < totalRoomsRequested) {
          // Nếu tổng số phòng còn lại của tất cả các loại cũng không đủ, trả về mảng rỗng
          return NextResponse.json({ success: true, data: [] }, { status: 200 });
      }

      // Sắp xếp theo trạng thái: 'limited' ưu tiên, sau đó đến 'available'
      const statusPriority = { 'limited': 1, 'available': 2, 'sold_out': 3 };
      allProcessedRooms.sort((a, b) => statusPriority[a.availabilityStatus] - statusPriority[b.availabilityStatus]);

      return NextResponse.json({ success: true, data: allProcessedRooms }, { status: 200 });

    } catch (error) {
      return handleError(error, "api") as ApiErrorResponse;
    }
}