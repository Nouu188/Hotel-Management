"use client";

import React, { useEffect, useMemo } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

const BirthdaySelector = () => {
  const form = useFormContext();

  // "Theo dõi" sự thay đổi của tháng và năm để tính toán lại số ngày
  const selectedMonth = form.watch("birthDay.month");
  const selectedYear = form.watch("birthDay.year");

  // --- Logic tính toán ---
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: `Tháng ${i + 1}`, 
  }));

  const daysInMonth = useMemo(() => {
    const year = parseInt(selectedYear, 10);
    const month = parseInt(selectedMonth, 10);

    if (!year || !month) {
      return 31; 
    }

    return new Date(year, month, 0).getDate();
  }, [selectedMonth, selectedYear]);

  const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  useEffect(() => {
    const currentDay = parseInt(form.getValues("birthDay.day"), 10);
    if (currentDay > daysInMonth) {
      form.setValue("birthDay.day", "");
    }
  }, [daysInMonth, form]);

  return (
    <div className="flex w-full items-center">
      <FormLabel className="min-w-[108px] text-[15px] hidden sm:block">Birthday</FormLabel>
      <div className="flex space-x-2 sm:space-x-4">
        {/* Day */}
        <FormField
          control={form.control}
          name="birthDay.day"
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="max-w-25 w-full">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Month */}
        <FormField
          control={form.control}
          name="birthDay.month"
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="min-w-30 w-full">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Year */}
        <FormField
          control={form.control}
          name="birthDay.year"
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger  className="min-w-30 w-full">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BirthdaySelector;