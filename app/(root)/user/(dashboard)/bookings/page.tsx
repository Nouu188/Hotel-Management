"use client";

import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

const BookingHistory = () => {
    const router = useRouter();
    useEffect(() => {
        router.push("/user/bookings/all");
    }, []);
}

export default BookingHistory;