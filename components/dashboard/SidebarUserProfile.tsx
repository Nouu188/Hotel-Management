// components/dashboard/SidebarUserBlock.tsx

"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { SquarePen } from "lucide-react";
import Link from "next/link";

export const SidebarUserBlock = () => {
  const { data: session, status } = useSession();

  // 1. Xử lý trạng thái đang tải session
  if (status === "loading") {
    return (
      <div className="flex items-center border-b pb-4 gap-4 mb-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }
  
  // 2. Xử lý khi không có session (đã đăng xuất)
  if (!session) {
    return null; // Hoặc hiển thị nút đăng nhập
  }
  
  return (
    <div className="flex items-center border-b pb-4 gap-4 mb-4">
      <Avatar className="w-14 h-14 border">
        <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User Avatar"} />

        <AvatarFallback className="text-xl font-semibold">
          {session.user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div>
        <p className="font-semibold text-lg">{session.user.name}</p>
        <Link
          href="/user/profile"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <SquarePen size={16} />
          <span>Sửa hồ sơ</span>
        </Link>
      </div>
    </div>
  );
};