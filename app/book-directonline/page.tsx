"use client";

import BillSearchingSection from "@/components/BillSearchingSection";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import RoomGuestSelector from "@/components/Rooms_Guests_Selector";
import RoomSearchingSection, { RoomInDetails } from "@/components/RoomSearchingSection";
import { useSyncBookingQuery } from "@/hooks/useSyncBookingQuery";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

const BookDirectOnline = () => {
    const searchParams = useSearchParams();

    const selectedBranch = searchParams.get('branch') as string;  
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const [items, setItems] = useState<{ adults: number; children: number; infants: number }[]>([{ adults: 2, children: 0, infants: 0 },]);
    const addOrRemoveRooms = (newRooms: { adults: number; children: number; infants: number }[]) => { 
        setItems(newRooms);
    };

    const initialDateRange = useMemo(() => {
        if(!fromDate || !toDate) {
            return;
        }
        const fromDateTime = new Date(fromDate);
        const toDateTime = new Date(toDate);

        return { from: fromDateTime, to: toDateTime };
    }, [fromDate, toDate]); 

    const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  
    useSyncBookingQuery({
      selectedBranch,
      dateRange,
      items,
    });

    const [selectedRoomForBill, setSelectedRoomForBill] = useState<RoomInDetails[]>([]);
    
    const handleRoomSelect = (room: RoomInDetails) => {
        setSelectedRoomForBill(prevItems => {
            if(prevItems.find(item => item.id === room.id)) {
                return prevItems;
            }

            return [...prevItems, room];
        })
    }

    const handleDeselectRoom = (roomId: string) => {
        setSelectedRoomForBill(prevItems => prevItems.filter(item => item.id !== roomId));
    }
      
    return (
        <div className={`flex flex-col justify-center bg-[#eff8fc] bg-no-repeat`}>
            <div className="w-full sticky h-18 z-10 bg-[#077dab]"></div>
            <div className="relative w-full h-[270px]">
                <Image
                    src="/images/7.jpg"
                    fill
                    className="object-cover"
                    alt="layout auth"
                />
            </div>

            <section className="z-10 flex justify-center -translate-y-12 w-full ">
                <div className="flex gap-5 container border-2 rounded-md max-w-291 border-[#077dab] px-5 py-8 w-full bg-white ">
                    <div className="space-y-1">
                        <h2 className="raleway text-sm text-[#56595E]">Branch</h2>
                        <div className="w-[340px] h-[50px] border-1 border-[#b4b2b2] rounded-sm flex justify-start items-center">
                            <p className="ml-3 raleway text-[17px]">
                                {selectedBranch}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="raleway text-sm text-[#56595E]">Select date</h2>
                        <DatePickerWithRange
                            value={dateRange}
                            isRounded
                            onChange={(range) => setDateRange(range)}
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <h2 className="raleway text-sm text-[#56595E]">Select rooms and guests</h2>
                        <RoomGuestSelector onAddOrRemoveRooms={addOrRemoveRooms}/>
                    </div>
                </div>
            </section>

            <section className="flex justify-center -translate-y-3 w-full">
                <div className="flex justify-between gap-4 max-w-291">
                    <div className="flex flex-col">
                        <RoomSearchingSection roomSelected={selectedRoomForBill} onRoomSelect={handleRoomSelect}/>
                    </div>
                    <div>
                        <BillSearchingSection
                            selectedRooms={selectedRoomForBill}
                            onDeselect={handleDeselectRoom}
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BookDirectOnline;