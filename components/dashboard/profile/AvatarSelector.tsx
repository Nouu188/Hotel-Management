"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { resizeImage } from "@/lib/utils";

const AvatarSelector = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { control, setValue } = useFormContext(); // Lấy thêm setValue
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const { data: session, status } = useSession();

  // Dùng state để lưu ảnh gốc, tránh gọi useSession nhiều lần
  const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.image) {
      setInitialAvatarUrl(session.user.image);
    }
  }, [session?.user?.image]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Tạo ảnh thumbnail với kích thước tối đa là 256x256
        const resizedDataUrl = await resizeImage(file, 256);
        
        // Cập nhật preview để người dùng thấy
        setPreviewUrl(resizedDataUrl);
        
        // Cập nhật giá trị của form với chuỗi base64 đã được tối ưu
        setValue("image", resizedDataUrl, { shouldValidate: true });

      } catch (error) {
        console.error("Lỗi resize ảnh:", error);
      }
    }
  };

  const imageToDisplay = previewUrl || initialAvatarUrl;

  return (
    <FormField
      control={control}
      name="image"
      render={() => ( // Không cần prop `field` nữa vì ta dùng setValue
        <FormItem>
          <FormLabel className="font-medium flex justify-center text-[16px]">Avatar</FormLabel>

          <div className="flex justify-center items-center h-28 my-4">
            {status === 'loading' ? (
              <Skeleton className="w-28 h-28 rounded-full" />
            ) : imageToDisplay ? (
              <img
                src={imageToDisplay}
                alt="Avatar"
                className="w-28 h-28 object-cover rounded-full"
              />
            ) : (
              <img
                src="/icons/user.svg"
                alt="Default avatar"
                className="w-28 h-28 object-cover rounded-full p-4 bg-gray-100"
              />
            )}
          </div>

          <FormControl>
            <div className="flex flex-col items-center gap-2">
              <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="py-2 px-6 min-h-10 cursor-pointer border text-[#066A92] border-[#066A92] hover:text-white hover:bg-[#066A92] rounded-sm transition-all duration-300 ease-in-out"
              >
                Chọn ảnh
              </button>
              <p className="text-xs text-gray-500">Dung lượng tối đa 5MB</p>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AvatarSelector;