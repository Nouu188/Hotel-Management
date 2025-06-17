"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { data: session } = useSession();
    return (
        <div lang="en" className="bg-[#eff8fc]"> 
            <section className="relative w-full h-[310px]"> 
                <Image 
                    src="/images/14.jpg" 
                    fill 
                    className="object-cover" 
                    alt="layout"
                    />

                <div 
                    className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/36 to-black/40" 
                />
            </section>

            <section className="container mx-auto flex justify-center py-8 gap-8">
                <div className="">
                    <div className="flex items-center border-b-1 py-4 gap-4 mb-4">
                        <div>
                            <Avatar className="w-[60px] h-[60px] flex justify-end">
                                <AvatarImage src="https://i.pinimg.com/736x/ec/b2/f8/ecb2f885b51eeb0204b6f2be4c19b8cf.jpg" />
                            </Avatar>
                        </div>

                        <div>
                            <p>{session?.user?.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <SquarePen/>
                                Edit your profile
                            </div>
                        </div>
                    </div>

                    <div className="flex-col flex space-y-4">
                        <Link href="/user/notifications" className="hover:text-[#BF882E] ease-in-out transition-all duration-300 cursor-pointer">🔔 Notifications</Link>
                        <Link href="/user/profile" className="hover:text-[#BF882E] ease-in-out transition-all duration-300 cursor-pointer">👤 Profile</Link>
                        <Link href="/user/bookings" className="hover:text-[#BF882E] ease-in-out transition-all duration-300 cursor-pointer">📖 Booking</Link>
                        <Link href="/user/settings" className="hover:text-[#BF882E] ease-in-out transition-all duration-300 cursor-pointer">⚙️ Setting</Link>
                    </div>                
                </div>

                <div className="max-w-[770px] w-full">
                    {children}
                </div>
            </section>
        </div>
    );
}