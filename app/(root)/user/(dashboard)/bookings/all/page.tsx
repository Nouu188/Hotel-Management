"use client";

import { useState, useEffect, useCallback } from 'react'; 
import { useInView } from 'react-intersection-observer';
import { Booking } from '@prisma/client';
import { Skeleton } from '@/components/ui/skeleton';

type BookingWithDetails = Booking;

export default function BookingList() {
    const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const { ref, inView } = useInView({ threshold: 0 });

    const loadMoreBookings = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        const apiUrl = `/api/users/bookings?limit=6${cursor ? `&cursor=${cursor}` : ''}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                if (response.status === 404) {
                    console.error("API endpoint not found. Check file path: app/api/users/bookings/route.ts");
                }
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                setBookings((prev) => [...prev, ...result.data]);
                setCursor(result.nextCursor);
                if (!result.nextCursor) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setIsLoading(false);
            
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        }
    }, [isLoading, hasMore, cursor, isInitialLoad]); 

    useEffect(() => {
        loadMoreBookings();
    }, []); 

    useEffect(() => {
        if (!isInitialLoad && inView) {
            loadMoreBookings();
        }
    }, [inView, isInitialLoad, loadMoreBookings]);

    if (isInitialLoad && isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    return (
        <div className='mt-2'>
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-md bg-white">
                        <p>Booking ID: {booking.id}</p>
                        <p>From: {new Date(booking.fromDate).toLocaleDateString()}</p>
                        <p>To: {new Date(booking.toDate).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

            {hasMore && <div ref={ref} className="h-1" />}

            {isLoading && !isInitialLoad && (
                <div className="space-y-4 mt-4">
                    <Skeleton className="h-24 w-full" />
                </div>
            )}
            
            {!hasMore && bookings.length > 0 && (
                <p className="text-center text-gray-500 mt-8">
                    You have reached the end of the list.
                </p>
            )}

            {!hasMore && bookings.length === 0 && !isLoading && (
                 <p className="text-center text-gray-500 mt-8">
                    You have no bookings yet.
                </p>
            )}
        </div>
    );
}