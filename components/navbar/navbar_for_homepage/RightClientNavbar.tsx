"use client";

import { navLinks } from '@/constants/navLinks'
import ROUTES from '@/constants/route'
import { ChevronDown, LogOut, Phone } from 'lucide-react'
import React from 'react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatar, AvatarImage } from '../../ui/avatar'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '../../ui/button';
import Link from 'next/link'
import { cn } from '@/lib/utils';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { generateLabel } from '@/components/Breadcrumbs';
import { NavigationMenuTrigger } from '@radix-ui/react-navigation-menu';

const RightClientNavbar = () => {
    const router = useRouter();
    const { data: session } = useSession();
   
    const userName = session?.user?.name;
    const avatarUrl = session?.user.image;

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.refresh(); 
    };

    return (
        <div>
            <div className='lg:hidden max-lg:-translate-x-6'>
                <Phone className='transform -scale-x-100' width={30} height={30}/>
            </div>
            <section className="-translate-y-5 flex-col max-lg:hidden">
                <div className="flex gap-4 justify-end mt-4">
                    <div className={cn("mb-3 flex items-center justify-end gap-4", userName && "translate-x-2")}>
                        <div className="hover:text-[#BF882E] flex items-center text-[14px] ease-in-out transition-all duration-300 hover:underline cursor-pointer">
                            Our properties
                            <ChevronDown className="w-[14px] h-[14px]"/>
                        </div>
                        <div className="hover:text-[#BF882E] text-[14px] ease-in-out transition-all duration-300 hover:underline cursor-pointer">EHG News</div>                
                        {userName ? (
                            <Menubar className="bg-transparent border-none">
                                <MenubarMenu>
                                    <MenubarTrigger className="border-none !bg-transparent">
                                        {avatarUrl ? (
                                            <Avatar className="w-10 h-10 cursor-pointer flex justify-end">
                                                <AvatarImage className="object-cover" src={avatarUrl} />
                                            </Avatar>
                                        ) : (
                                            <img
                                                src="/icons/user.svg"
                                                alt="Default avatar"
                                                className="w-10 h-10 object-cover rounded-full p-4 bg-gray-100"
                                            />
                                        )}
                                    </MenubarTrigger>

                                    <MenubarContent align="center" style={{ width: "100px", minWidth: "unset" }} className="playfair z-300 flex flex-col justify-center text-md">
                                        <MenubarItem 
                                            className="flex whitespace-nowrap gap-3 hover:bg-transparent hover:text-[#BF882E] ease-in-out transition-all duration-300 cursor-pointer" 
                                            onClick={() => router.push("/user/profile")}
                                        >
                                            Dashboard
                                        </MenubarItem>
                                        <MenubarItem 
                                            className="flex whitespace-nowrap gap-3 hover:bg-transparent hover:text-[#BF882E] ease-in-out transition-all duration-300 cursor-pointer" 
                                            onClick={handleSignOut}
                                        >
                                            Log Out
                                            <LogOut />
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        ) : (
                            <div className="space-x-3">
                                <Button className="bg-[#081746] rounded-sm hover:bg-[#0f225e]">
                                    <Link href={ROUTES.SIGN_IN} className="playfair text-md">
                                        Sign In
                                    </Link>
                                </Button>

                                <Button className="bg-[#081746] rounded-sm hover:bg-[#0f225e]">
                                    <Link href={ROUTES.SIGN_UP} className="playfair text-md">
                                        Sign Up
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <nav className="flex gap-10 max-xl:gap-8">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList className='gap-10 max-xl:gap-8'>
                            {navLinks.slice(4, 8).map((item, index) => (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuTrigger className="whitespace-nowrap hover:text-[#BF882E] hover:bg-transparent transition-colors duration-200">
                                        <Link href={item.route}> {item.label}</Link>
                                    </NavigationMenuTrigger>
                                    {item.items && (
                                        <NavigationMenuContent className='text-[13px] z-110 space-y-2 p-3 lg:max-w-84 w-full text-black'>
                                            {item.items?.map((element, index) => (
                                                <div className='' key={index} >
                                                    <Link className='whitespace-nowrap hover:text-[#BF882E] hover:bg-transparent transition-colors duration-200' href={`${item.route}/${element.name}`}>
                                                        {generateLabel(element.name)}
                                                    </Link>
                                                </div>
                                            ))}
                                        </NavigationMenuContent>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>          
                </nav>
            </section>
        </div>
    )
}

export default RightClientNavbar