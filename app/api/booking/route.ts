import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { ApiErrorResponse } from "@/types/global";
import { Prisma, RoomStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET (
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if(!id) {
        throw new NotFoundError("Room");
    }

    try {
        const bookingRoomItem = prisma.bookingRoomItem.findUnique({
            where: { id }
        });
        if(!bookingRoomItem) {
            throw new NotFoundError("Room");
        }

        return NextResponse.json(
            { success: true, data: bookingRoomItem },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}

export async function POST (request: Request) {
    try {
        const roomIdsToUpdate: string[] = [];
        const body = await request.json();

        const { bookingGuest, bookingData, roomItems } = body;

        if (!bookingData || !roomItems || !Array.isArray(roomItems) || roomItems.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid input: 'bookingData' and a non-empty 'roomItems' array are required." },
                { status: 400 }
            );
        }

        let fromDateTime: Date;
        let toDateTime: Date;
        try {
            fromDateTime = new Date(bookingData.fromDate);
            toDateTime = new Date(bookingData.toDate);

            if (isNaN(fromDateTime.getTime()) || isNaN(toDateTime.getTime())) {
                throw new Error("Invalid date format provided.");
            }
        } catch (dateError) {
             console.error("Date parsing error:", dateError);
             return NextResponse.json({ success: false, message: "Invalid date format for fromDate or toDate." }, { status: 400 });
        }

        const newBooking = await prisma.booking.create({
            data: {
                fromDate: fromDateTime,
                toDate: toDateTime
            }
        });

        const bookingRoomItemsData = roomItems.map(item => {
            roomIdsToUpdate.push(item.id);

            return ({
                bookingId: newBooking.id,
                roomId: item.id,                
            })
        });
        const newBookingRoomItem = await prisma.bookingRoomItem.createMany({
            data: bookingRoomItemsData,
            skipDuplicates: true,        
        });

        const newBookingGuestData = {
            ...bookingGuest,
            bookingId: newBooking.id,
        };
        const newBookingGuest = await prisma.bookingGuest.create({
            data: newBookingGuestData,
        });

        await prisma.room.updateMany({
            where: {                     
               id: { in: roomIdsToUpdate }, 
            },
            data: { status: RoomStatus.BOOKED }
        })

        return NextResponse.json(
            { success: true, data: { newBooking, newBookingRoomItem, newBookingGuest } },
            { status: 201 }
        );
    } catch (error) {
        console.error("!!! API ERROR CAUGHT:", error);

        // Phân tích lỗi cụ thể hơn nếu cần
        let errorMessage = "An unexpected error occurred.";
        let statusCode = 500;

        if (error instanceof SyntaxError) { // Lỗi parse JSON
            errorMessage = "Invalid JSON format in request body.";
            statusCode = 400;
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Lỗi từ Prisma Client (ví dụ: vi phạm constraint)
            errorMessage = `Database error: ${error.code}. Check server logs for details.`;
            // Có thể đặt statusCode cụ thể hơn dựa vào error.code
            if (error.code === 'P2002') { // Unique constraint
                errorMessage = `Data conflict: ${error.meta?.target || 'Unique constraint failed'}.`;
                statusCode = 409; // Conflict
            } else if (error.code === 'P2003' || error.code === 'P2025') { // Foreign key or record not found
                 errorMessage = `Invalid reference: ${error.meta?.field_name || 'Related record'} not found.`;
                 statusCode = 400; // Bad Request
            } else {
                 statusCode = 500; // Lỗi server khác
            }
        } else if (error instanceof Error) {
             // Các lỗi JavaScript thông thường khác
             errorMessage = error.message;
             // Giữ statusCode 500 hoặc tùy chỉnh
        }

        // Trả về lỗi đã được xử lý
        return NextResponse.json({ success: false, message: errorMessage, code: (error as any).code, meta: (error as any).meta }, { status: statusCode });

    }
}