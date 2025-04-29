"use client"

import { addDays, format } from "date-fns"
import { CalendarIcon, MoveRight } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  value,
  isRounded,
  onChange,
  className,
}: {
  value?: DateRange
  isRounded?: boolean
  onChange?: (range: DateRange | undefined) => void
  className?: string
}) {
  const handleSelect = (range: DateRange | undefined) => {
    onChange?.(range); 
    console.log(range)
  };

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[370px] py-[24.5px] border-[#b4b2b2] raleway text-[17px] rounded-none justify-start text-left font-normal",
              !value && "text-muted-foreground", isRounded && "rounded-sm", className && `${className}`
            )}
          >
            <CalendarIcon height={14} width={14} />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} <MoveRight />{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-100" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
