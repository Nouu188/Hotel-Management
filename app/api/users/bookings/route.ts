import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import handleError from '@/lib/handlers/error';
import { ApiErrorResponse } from '@/types/global';
import { authOptions } from '@/auth';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '10'); 
        const cursor = url.searchParams.get('cursor') || undefined; 

        const bookings = await prisma.booking.findMany({
            take: limit, 
            skip: cursor ? 1 : 0, 
            cursor: cursor ? { id: cursor } : undefined,
            
            where: {
                userId: session.user.id,
            },
            orderBy: {
                fromDate: 'desc', 
            },
            include: {
                bill: true,
                bookingGuest: true,
                bookingRoomItems: {
                    include: {
                        hotelBranchRoomType: {
                            include: { roomType: true, hotelBranch: true }
                        }
                    }
                }
            }
        });

        let nextCursor: typeof cursor | null = null;
        if (bookings.length === limit) {
            nextCursor = bookings[limit - 1].id;
        }
        console.log(nextCursor)
        return NextResponse.json({
            success: true,
            data: bookings,
            nextCursor: nextCursor 
        });

    } catch (error) {
        return handleError(error, "api") as ApiErrorResponse;
    }
}