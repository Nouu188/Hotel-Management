"use client";

import { Phone, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useCurrentUser } from "@/hooks/use-CurrentUser";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import AvatarEditor from "./dashboard/profile/AvatarEditor";


const UserProfileCard = () => {
    const { user } = useCurrentUser();

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="h-24 bg-white bg-cover relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <AvatarEditor />
            </div>
        </div>
        <div className="pt-13 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mt-1">{user?.name}</h2>
            <div className="mt-3 space-y-4">
                
            <div className="flex flex-col items-start px-6 space-y-3">
                <div className="flex items-center justify-center gap-3 text-gray-600">
                    <div className="p-2 rounded-lg">
                        <Phone size={20} className="text-[#077dab]" />
                    </div>
                    <div className="flex">
                        <Input placeholder={user?.phoneNumber ?? "Add phone number"}/>
                    </div>

                    <div>Edit</div>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-600">
                    <div className="p-2 rounded-lg">
                        <Mail size={20} className="text-[#077dab]" />
                    </div>
                    <span>{user?.email}</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
};

export default UserProfileCard;