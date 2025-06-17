"use client";

import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormContext } from "react-hook-form";

const GenderSelector = () => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem className="flex">
          <FormLabel className="min-w-[100px] text-[15px]">Gender</FormLabel>
          <RadioGroup onValueChange={field.onChange} className="flex space-x-4" defaultValue={field.value}>
            {["male", "female", "other"].map((value) => (
              <FormItem key={value} className="flex items-center">
                <FormControl>
                  <RadioGroupItem value={value} />
                </FormControl>
                <FormLabel>{value.charAt(0).toUpperCase() + value.slice(1)}</FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormItem>
      )}
    />
  );
};

export default GenderSelector;
