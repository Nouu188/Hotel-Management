"use client";

import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const AvatarSelector = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-medium flex justify-center text-[16px]">Avatar</FormLabel>

            <div className="flex justify-center max-h-[100px] my-4">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-full"
                    />
                ) : (
                    <img
                        src="/icons/user.svg"
                        className="w-24 h-24 object-cover rounded-full p-4 bg-gray-100"
                    />
                )}          
            </div>

          <FormControl>
            <div className="flex justify-center">
                <Input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                        field.onChange(file);
                        setPreviewUrl(URL.createObjectURL(file));
                        }
                    }}
                    className="hidden"
                />
                <button 
                    type="button"
                    onClick={() => inputRef.current?.click()} 
                    className="py-2 px-6 min-h-10 cursor-pointer border-1 text-[#066A92] border-[#066A92] hover:text-white hover:bg-[#066A92] rounded-sm transition-all duration-300 ease-in-out"
                >
                    Select avatar
                </button>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AvatarSelector;
