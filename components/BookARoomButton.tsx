"use client"

import { RootState } from '@/store/store';
import { addDays } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useSelector } from 'react-redux';
import { Button } from './ui/button';

const BookARoomButton = () => {
    const router = useRouter();

    const selectedBranch = useSelector((state: RootState) => state.filterHotelRoomType.selectedBranch);
    const dateRange = useSelector((state: RootState) => state.filterHotelRoomType.dateRange);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const fromDate = dateRange?.from?.toISOString().split("T")[0];
        let toDate: string | undefined;

        if (dateRange?.to) {
        const tmpDate = addDays(new Date(), 1); 
        if (tmpDate.getDay() === dateRange.to.getDay()) {
            toDate = dateRange?.to?.toISOString().split("T")[0];
        } else {
            const originalToDate = dateRange.to;
            const oneDayMillis = 24 * 60 * 60 * 1000;
            const nextDayTimeMillis = originalToDate.getTime() + oneDayMillis;
            const modifiedToDate = new Date(nextDayTimeMillis);
            toDate = modifiedToDate.toISOString().split("T")[0];
        }
        } else {
        toDate = fromDate; 
        }

        if (fromDate && !toDate) {
        toDate = fromDate;
        }

        router.push(
        `/book-directonline?branch=${encodeURIComponent(selectedBranch)}&fromDate=${fromDate}&toDate=${toDate}`
        );
    };
  return (
    <Button onClick={handleSubmit} className='rounded-none text-[12px] bg-[#bf882e] cursor-pointer max-h-[32px]'>
        Book a Room
        <ArrowRight/>
    </Button>
  )
}

export default BookARoomButton