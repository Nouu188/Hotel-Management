import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

interface RequestBody {
  roomTypeId: string;
  hotelBranchId: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
}


// Mục đích: Tìm số phòng nhỏ nhất khi khách hàng nhấn vào xem chi tiết phòng 
// thì API sẽ trả về lượng phòng tối thiểu có thể đặt 
export async function POST(request: Request) {
  try {
// --- BƯỚC 1: VALIDATE INPUT ---
    const body = await request.json() as RequestBody;
    const { roomTypeId, hotelBranchId, dateRange } = body;

    if (!roomTypeId || !hotelBranchId || !dateRange?.from || !dateRange?.to) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (roomTypeId, hotelBranchId, dateRange with from/to)." },
        { status: 400 }
      );
    }
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate >= toDate) {
      return NextResponse.json(
        { success: false, message: "Invalid date range." },
        { status: 400 }
      );
    }
// --- BƯỚC 2: TÌM BẢN GHI KHO PHÒNG TƯƠNG ỨNG ---
      const hotelBranchRoomType = await prisma.hotelBranchRoomType.findUnique({
        where: {
          // Cú pháp đúng để tìm bằng unique composite key
          hotelBranchId_roomTypeId: {
            hotelBranchId,
            roomTypeId,
          },
        },
        select: { id: true },
      });

    if (!hotelBranchRoomType) {
      return NextResponse.json({ success: false, message: `Không tìm thấy loại phòng này tại chi nhánh.` }, { status: 404 });
    }

// --- BƯỚC 3: TRUY VẤN TẤT CẢ CÁC NGÀY TRONG KHOẢNG THỜI GIAN ---
    const dailyAvailabilities = await prisma.roomAvailability.findMany({
      where: {
        hotelBranchRoomTypeId: hotelBranchRoomType.id,
        date: {
          gte: fromDate,
          lt: toDate,
        }
      },
      select: {
        date: true,
        totalRooms: true,
        bookedRooms: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const numberOfNights = Math.ceil(toDate.getTime() - toDate.getTime());

    if(numberOfNights > dailyAvailabilities.length) {
      console.warn("Room inventory data is lack for some of days selected.");
      
      return NextResponse.json({  
          success: true, 
          data: { avalableQuantity: 0 } 
      }); 
    }

    const dailyQuantities = dailyAvailabilities.map(day => day.totalRooms - day.bookedRooms);

    const availableQuantity = Math.min(...dailyQuantities);

    return NextResponse.json(
      { success: true, data: { availableQuantity } },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as ApiErrorResponse;
  }
}