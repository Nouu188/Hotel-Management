"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserProfileSchema } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { NotFoundError } from '@/lib/http-errors';
import { ActionResponse } from '@/types/global';
import { User } from '@prisma/client';
import { ProfileSkeleton } from '@/components/dashboard/profile/ProfileSkeleton';
import GenderSelector from '@/components/dashboard/profile/GenderSelector';
import BirthdaySelector from '@/components/dashboard/profile/BirthdaySelector';
import AvatarSelector from '@/components/dashboard/profile/AvatarSelector';
import { maskEmail, maskPhoneNumber } from '@/lib/utils';

type UserProfileFormValues = z.infer<typeof UserProfileSchema>;

const ProfileView = () => {
    const router = useRouter();
    const { data: session, status, update: updateSession } = useSession(); 
    
    const [userProfile, setUserProfile] = useState<User | null>(null);

    // --- Authentication Check ---
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
    }, [status, router]);

    const form = useForm<UserProfileFormValues>({
        resolver: zodResolver(UserProfileSchema),
        defaultValues: {
            name: "",
            gender: "other", // Default an toàn
            birthDay: { day: "", month: "", year: "" },
            image: undefined,
        },
    });

    // --- NEW: Fetch Profile Data on Mount ---
    useEffect(() => {
        const fetchProfile = async () => {
            if (!session?.user?.id) return;

            try {
                const res = await api.users.getById(session.user.id) as ActionResponse<User>;

                if (res.success && res.data) {
                    const profile = res.data;
                    setUserProfile(profile);
                    
                    form.reset({
                        name: profile.name || "",
                        gender: profile.gender || "other",
                        birthDay: profile.birthDay ? {
                            day: new Date(profile.birthDay).getDate().toString(),
                            month: (new Date(profile.birthDay).getMonth() + 1).toString(),
                            year: new Date(profile.birthDay).getFullYear().toString(),
                        } : { day: "", month: "", year: "" },
                        image: profile.image || undefined,
                    });
                } else {
                    toast({ title: "Error", description: "Could not fetch profile data."});
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                toast({ title: "Error", description: "An error occurred while fetching your profile."});
            }
        };

        if (status === "authenticated") {
            fetchProfile();
        }
    }, [status, session?.user?.id, form.reset]);

    if (status === 'loading' || (status === 'authenticated' && !userProfile)) {
        return <ProfileSkeleton />;
    }

    async function onSubmit(values: UserProfileFormValues) {
        if (!session?.user?.id) {
            throw new NotFoundError("User not found");
        }

        const { day, month, year } = values.birthDay!;

        const birthDayDate = (year && month && day) 
            ? new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`) 
            : undefined;

        const updatedProfileData = {
            ...values,
            birthDay: birthDayDate,
        };

        try {
            const res = await api.users.update(session.user.id, updatedProfileData) as ActionResponse<User>;

            if (res.success && res.data) {
                toast({
                    title: "Profile Updated Successfully!",
                    description: "Your profile has been updated.",
                });
                // Cập nhật session để tên/ảnh mới hiển thị ngay lập tức ở nơi khác
                await updateSession({ user: { ...session.user, name: res.data.name, image: res.data.image } });
                setUserProfile(res.data); // Cập nhật state local
            } else {
                throw new Error("Could not update your profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Update Error",
                description: error instanceof Error ? error.message : "An unexpected error occurred.",
            });
        }
    }

    return (
        <div className='px-8 rounded-sm w-full bg-white'>
            <section className='py-4 border-b-1'>
                <h1 className='font-medium text-[20px]'>My Profile</h1>
                <p>Manage profile information to keep your account secure</p>
            </section>

            <section className='flex py-8 w-full'>
                <Form {...form}>
                    <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <div className="space-y-8 pr-7">
                                {/* Name */}
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem className='flex items-center'>
                                        <FormLabel className='min-w-[100px] font-medium text-[15px]'>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}/>

                                {/* Email */}
                                <div className='flex items-center gap-2'>
                                    <div className='font-medium min-w-[100px] text-[15px]'>Email</div>
                                    <div>{session?.user?.email ? maskEmail(session.user.email) : "No email available"}</div>
                                </div>

                                {/* Phone Number */}
                                <div className='flex items-center gap-2'>
                                    <div className='font-medium min-w-[100px] text-[15px]'>Phone</div>
                                    <div>{userProfile?.phoneNumber ? maskPhoneNumber(userProfile.phoneNumber) : "Not updated"}</div>
                                </div>

                                {/* Gender */}
                                <GenderSelector />

                                {/* Birthday */}
                                <BirthdaySelector />
                            </div>

                            {/* Avatar */}
                            <div className='flex-1 justify-center items-center border-l-1 pl-7'>
                                <AvatarSelector />
                            </div>
                        </div>

                        <Button
                            className='bg-[#077dab] hover:bg-[#3c5c6a] w-auto mt-8 px-6 py-2 text-md rounded-sm transition-all'
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </section>
        </div>
    );
}

export default ProfileView;