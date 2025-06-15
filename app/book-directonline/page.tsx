"use client";

import BillSearchingSection from "@/components/bill/BillSearchingSection";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import RoomGuestSelector from "@/components/Rooms_Guests_Selector";
import { hotelBranches } from "@/constants/hotelBranches";
import { useSyncBookingQuery } from "@/hooks/useSyncBookingQuery";
import { AppDispatch, RootState } from "@/store/store";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useDispatch, useSelector } from "react-redux";
import { setDateRange, setSelectedBranch } from "@/store/slices/filterHotelRoomTypeSlice"; 
import HotelBranchRoomTypeFilterSection from "@/components/filter/HotelBranchRoomTypeFilterSection";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const BookDirectOnline = () => {
    const form = useForm();
    const dispatch: AppDispatch = useDispatch();
    const searchParams = useSearchParams();
    const [openPromoCode, setOpenPromoCode] = useState(false);

    const selectedBranch = useSelector((state: RootState) => state.filterHotelRoomType.selectedBranch);
    const dateRange = useSelector((state: RootState) => state.filterHotelRoomType.dateRange);
    const guestAllocation = useSelector((state: RootState) => state.filterHotelRoomType.guestAllocation);
    
    useEffect(() => {
        const branchFromUrl = searchParams.get("branch");
        const fromDateFromUrl = searchParams.get("fromDate");
        const toDateFromUrl = searchParams.get("toDate");

        if (branchFromUrl && branchFromUrl !== selectedBranch && hotelBranches.some(b => b.name === branchFromUrl)) {
            dispatch(setSelectedBranch(branchFromUrl));
        }

        if (fromDateFromUrl && toDateFromUrl) {
            try {
                const newFrom = new Date(fromDateFromUrl);
                const newTo = new Date(toDateFromUrl);
                
                if (!isNaN(newFrom.getTime()) && !isNaN(newTo.getTime()) && (newFrom.getTime() !== dateRange?.from?.getTime() || newTo.getTime() !== dateRange?.to?.getTime())) 
                {
                    dispatch(setDateRange({ from: newFrom, to: newTo }));
                }
            } catch (error) {
                console.error("Error parsing dates from URL:", error);
            }
        }
    }, [searchParams]); 

    useSyncBookingQuery({
        selectedBranch,
        dateRange,
        items: guestAllocation, 
    });

    const handleDateChange = (newRange: DateRange | undefined) => {
        dispatch(setDateRange(newRange));
    }
      
    return (
        <div className={`flex flex-col justify-center bg-[#eff8fc] bg-no-repeat`}>
            <div className="max-md:hidden relative w-full h-[260px]">
                <Image
                    src="/images/13.jpg"
                    fill
                    className="object-cover"
                    alt="layout auth"
                />
            </div>

            <section className="z-10 md:flex md:-mt-12 justify-center w-full max-md:shadow-md ">
                <div className="md:container w-full md:border-2 md:px-5 md:rounded-md md:max-w-244 lg:max-w-253 max-md:py-2 md:border-[#077dab] bg-white">
                    <div className={cn(openPromoCode && "md:border-b-1", "flex gap-5 py-4 w-full max-md:px-4 max-md:flex-col")}>
                        <div className="space-y-1">
                            <h2 className="raleway max-md:hidden text-sm text-[#56595E]">Select date</h2>
                            <DatePickerWithRange
                                value={dateRange}
                                isRounded
                                onChange={handleDateChange}
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <h2 className="raleway max-md:hidden text-sm text-[#56595E]">Select rooms and guests</h2>
                            <RoomGuestSelector 
                                guestAllocations={guestAllocation} 
                            />
                        </div>

                        {!openPromoCode && (
                            <button 
                                className="hover:text-[#077dab] text-[#393b3f] translate-y-2 flex items-center gap-1 cursor-pointer transition-colors duration-300 ease-in-out"
                                onClick={() => {
                                    setOpenPromoCode(!openPromoCode);
                                }}
                            >
                                <Tag className="w-5"/>
                                <p>Have a promo code?</p>
                            </button>
                        )}
                    </div>
                    {openPromoCode && (
                        <div className="flex justify-start py-4 gap-6 max-md:px-4">
                            <div className="flex">
                                <Input placeholder="Enter your promo code" className="max-w-[214px] h-[44px] rounded-tl-sm rounded-bl-sm rounded-tr-[2px] rounded-br-[2px]" />
                                <Button className="h-[44px] bg-[#077dab] hover:bg-[#077dabf7] rounded-tr-sm rounded-br-sm rounded-tl-[2px] rounded-bl-[2px]">Apply</Button>
                            </div>
                            <button 
                                className="hover:text-[#077dab] text-[#393b3f] cursor-pointer transition-colors duration-300 ease-in-out"
                                onClick={() => {
                                    setOpenPromoCode(!openPromoCode);
                                }}    
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <section className="flex justify-center mt-8 w-full">
                <div className="flex justify-between gap-2 lg:gap-4 max-w-291">
                    <div className="flex flex-col mb-4">
                        <HotelBranchRoomTypeFilterSection />
                    </div>
                    <div className="max-md:hidden">
                        <BillSearchingSection />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BookDirectOnline;