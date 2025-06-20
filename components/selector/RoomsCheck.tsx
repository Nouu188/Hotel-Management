"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { hotelBranches } from "@/constants/hotelBranches";

import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useSelector, useDispatch } from 'react-redux'; 
import { RootState, AppDispatch } from '@/store/store'; 
import { setDateRange, setSelectedBranch } from "@/store/slices/filterHotelRoomTypeSlice";
import BranchPicker from "./BranchPicker";
import { DatePickerWithRange } from "../DatePickerWithRange";
import { Button } from "../ui/button";

const RoomsCheck = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch(); 

  const selectedBranch = useSelector((state: RootState) => state.filterHotelRoomType.selectedBranch);
  const dateRange = useSelector((state: RootState) => state.filterHotelRoomType.dateRange)
  
  const handleBranchChange = (value: string) => {
    dispatch(setSelectedBranch(value)); 
  };

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    dispatch(setDateRange(newDateRange)); 
  };

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
    <form onSubmit={handleSubmit}>
      <div className=" flex justify-center items-center">
        <div className="flex justify-center items-center lg:gap-6 playfair container max-w-[980px] max-xl:max-w-[745px] text-lg lg:p-5 bg-[#081746]">
          <BranchPicker
            hotelBranches={hotelBranches}
            onValueChange={handleBranchChange} 
            defaultValue={selectedBranch} 
            className="border-black rounded-none py-[19.4px] container"
          />

          <DatePickerWithRange
            className="py-[19.4px] container"
            value={dateRange} 
            onChange={handleDateChange} 
          />

          <Button
            type="submit"
            className="bg-[#bf882e] container rounded-none text-[18px] max-w-[170px] max-xl:max-w-[120px] hover:bg-amber-700 py-[20.5px]"
          >
            Check now
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RoomsCheck;