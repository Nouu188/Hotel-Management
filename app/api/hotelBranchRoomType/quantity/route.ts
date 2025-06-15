import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { parseISO } from "date-fns";

interface RequestBody {
  roomTypeId: string;
  hotelBranchId: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const { roomTypeId, hotelBranchId, dateRange } = body;

    if (!roomTypeId || !hotelBranchId || !dateRange?.from || !dateRange?.to) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (roomTypeId, hotelBranchId, dateRange with from/to)." },
        { status: 400 }
      );
    }

    const fromDate = parseISO(dateRange.from);
    const toDate = parseISO(dateRange.to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate >= toDate) {
      return NextResponse.json(
        { success: false, message: "Invalid date range." },
        { status: 400 }
      );
    }

    const hotelBranchRoomType = await prisma.hotelBranchRoomType.findUnique({
      where: {
        hotelBranchId_roomTypeId: {
          hotelBranchId,
          roomTypeId,
        },
      },
      include: {
        bookingItems: {
          where: {
            booking: {
              AND: [
                { fromDate: { lt: toDate } },
                { toDate: { gt: fromDate } },
              ],
            },
          },
          include: {
            booking: true,
          },
        },
      },
    });

    if (!hotelBranchRoomType) {
      throw new NotFoundError("HotelBranchRoomType");
    }

    let totalBookedInPeriod = 0;
    hotelBranchRoomType.bookingItems.forEach((bookingItem) => {
      const bookingStartDate = bookingItem.booking.fromDate;
      const bookingEndDate = bookingItem.booking.toDate;

      if (bookingStartDate < toDate && bookingEndDate > fromDate) {
        totalBookedInPeriod += bookingItem.quantityBooked;
      }
    });

    const remainingQuantity = Math.max(0, hotelBranchRoomType.quantity - totalBookedInPeriod);

    return NextResponse.json(
      { success: true, data: { remainingQuantity } },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}