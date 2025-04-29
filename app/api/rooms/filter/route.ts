import { RoomInDetails } from "@/components/RoomSearchingSection";
import handleError from "@/lib/handlers/error";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { items, branchName } = body;

      const totalGuestPerRoom = items.map(
        (item: any) => item.adults + item.children + item.infants
      );

      const roomsNested = await Promise.all(
        totalGuestPerRoom.map(async (guestCount: number) => {
          return await prisma.room.findMany({
            where: {
              roomIndetail: {
                capacity : {
                  gte: guestCount,
                }
              },
              hotel: {
                name: branchName,
              },
            },
            include: {
              hotel: true,
              roomIndetail: true,
            },
          });
        })
      );
      
      const allRooms = roomsNested.flat();

      const uniqueRoomsMap = new Map<string, RoomInDetails>(); 

      allRooms.forEach(room => {
        uniqueRoomsMap.set(room.id, room); 
      });

      const uniqueRooms = Array.from(uniqueRoomsMap.values());

      return NextResponse.json(
          { success: true, data: uniqueRooms }, 
          { status: 200 }
      );
    } catch (error) {
      return handleError(error, "api") as ApiErrorResponse;
    }
  }
  