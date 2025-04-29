"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { hotelBranches } from "@/constants/hotelBranches"
import { DatePickerWithRange } from "./DatePickerWithRange"
import { Button } from "./ui/button"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import BranchPicker from "./BranchPicker"

const RoomsCheck = () => {
  const router = useRouter()

  const [selectedBranch, setSelectedBranch] = useState(hotelBranches[0].name)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  })
  console.log(dateRange)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fromDate = dateRange?.from?.toISOString().split("T")[0];

    let toDate: string | undefined;

    if (dateRange?.to) {
      const tmpDate = addDays(new Date(), 1);

      if(tmpDate.getDay() === dateRange.to.getDay()) {
        toDate = dateRange?.to?.toISOString().split("T")[0];
        console.log("toDateMain: ", toDate)
      } else {
        const originalToDate = dateRange.to;
        const originalTimeMillis = originalToDate.getTime();
        const oneDayMillis = 24 * 60 * 60 * 1000;
        const nextDayTimeMillis = originalTimeMillis + oneDayMillis;
        const modifiedToDate = new Date(nextDayTimeMillis);
        console.log(modifiedToDate)
        toDate = modifiedToDate.toISOString().split("T")[0];
      }
    } else {
        toDate = undefined;
    }

    router.push(
      `/book-directonline?branch=${encodeURIComponent(selectedBranch)}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <section className="flex justify-center items-center gap-6 playfair text-lg py-3 bg-[#081746]">
        <BranchPicker 
          hotelBranches={hotelBranches} 
          onValueChange={(value) => setSelectedBranch(value)} 
          defaultValue={selectedBranch}
          className="border-black rounded-none py-[19.4px]"
        />

        <DatePickerWithRange className="py-[19.4px]" value={dateRange} onChange={setDateRange} />

        <Button
          type="submit"
          className="bg-[#bf882e] rounded-none text-[18px] w-[170px] hover:bg-amber-700 py-[20.5px]"
        >
          Check now
        </Button>
      </section>
    </form>
  )
}

export default RoomsCheck
