"use client";

import BillSearchingSection from "@/components/BillSearchingSection";
import BookingProcedure from "@/components/BookingProcedure";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import RoomGuestSelector from "@/components/Rooms_Guests_Selector";
import RoomSearchingSection, { RoomInDetails, RoomInDetails } from "@/components/RoomSearchingSection";
import { useSyncBookingQuery } from "@/hooks/useSyncBookingQuery";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

const BookingPage = () => {
    const [RoomInDetailss, setRoomInDetailss] = useState<RoomInDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedItemsString = sessionStorage.getItem('selectedRoomInDetailss');

            if (storedItemsString) {
                    const parsedItems: RoomInDetails[] = JSON.parse(storedItemsString);
                    console.log(parsedItems)
                    setRoomInDetailss(parsedItems);
                   
                    // Xóa khỏi storageSesion sau khi đã đọc
                    sessionStorage.removeItem('selectedRoomInDetailss');
            } 
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <div>Loading booking details...</div>;
    }

    return (
        <div className={`flex flex-col justify-center bg-[#eff8fc] bg-no-repeat`}>
            <div className="w-full sticky h-18 z-10 bg-[#077dab]"></div>

            <section className="flex justify-center translate-y-10 w-full">
                <div className="flex justify-between gap-4 max-w-291">
                    <div className="flex flex-col space-y-5">
                        <RoomSearchingSection booking roomSelected={RoomInDetailss}/>
                        <BookingProcedure selectedRooms={RoomInDetailss}/>
                    </div>
                    <div>
                        <BillSearchingSection
                            selectedRooms={RoomInDetailss}
                            booking
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BookingPage;