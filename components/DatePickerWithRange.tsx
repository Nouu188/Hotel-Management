"use client"

import { format } from "date-fns"
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
    if (!onChange) return;

    const adjustToUTC = (date: Date): Date => {
      const timezoneOffset = date.getTimezoneOffset() * 60000; 
      return new Date(date.getTime() - timezoneOffset);
    };

    if (range?.from && range?.to) {
      onChange({
        from: adjustToUTC(range.from),
        to: adjustToUTC(range.to),
      });
    } else if (range?.from) {
      onChange({
        from: adjustToUTC(range.from),
        to: undefined,
      });
    } else {
      onChange(undefined);
    }
};

  return (
    <div className={cn("grid gap-2 max-md:justify-center max-md:flex")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "xl:w-[340px] md:w-[280px] py-[24.5px] w-full max-w-[780px] border-[#b4b2b2] raleway text-[17px] rounded-none justify-start text-left font-normal",
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
        <PopoverContent className="max-md:max-w-[800px] w-full p-0 z-100" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={handleSelect}
            numberOfMonths={3}
            className="border-b-1 font-semibold"
            classNames={{
                months: 'flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4',
                month: 'w-full mx-4',
            }}
          />
          <p className="text-sm raleway font-semibold p-2">Select check-in date</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
