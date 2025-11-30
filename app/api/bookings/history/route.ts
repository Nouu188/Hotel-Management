import { NextResponse } from 'next/server';
import { authOptions } from '@/auth'; 
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                bookingRoomItems: {
                include: {
                    hotelBranchRoomType: {
                    include: {
                        roomType: true,
                        hotelBranch: true,
                    },
                    },
                },
                },
            },
        });

        const formattedBookings = bookings.map(booking => {
            const firstItem = booking.bookingRoomItems[0];
            if (!firstItem) return null;

            const roomType = firstItem.hotelBranchRoomType.roomType;
            const roomNumber = `#${booking.id.slice(-5).toUpperCase()}`;

            return {
                id: booking.id,
                roomNumber: roomNumber,
                roomName: roomType.name,
                bedType: roomType.bedType || 'N/A',
                floor: 'N/A', 
                facilities: roomType.description,
                bookDate: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(booking.createdAt),
                bookTime: new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(booking.createdAt),

                fromDate: booking.fromDate.toISOString(), 
                toDate: booking.toDate.toISOString(), 
                status: booking.status,                
                capacity: roomType.capacity,           
                images: roomType.image,    
                imageUrl: roomType.image[0] || '/placeholder-room.jpg',
            };
        }).filter(Boolean);

        return NextResponse.json({
            success: true,
            data: formattedBookings,
        });
    } catch (error) {
        console.error("API Error - Failed to fetch history bookings:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}