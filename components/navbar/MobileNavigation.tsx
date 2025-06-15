"use client";

import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronDown, ChevronUp, Menu } from 'lucide-react'
import { navLinks } from '@/constants/navLinks'
import { hotelBranches } from '@/constants/hotelBranches'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import Link from 'next/link';

const mobileNavigationItems = [
    {
        name: "ROOMS & SUITES"
    },
    {
        name: "RESTAURANT & BAR",
        elements: ["Cloud Nine Saigon Restaurant", "Twilight Sky Bar Saigon"]
    },
    {
        name: "SPECIAL OFFERS"
    },
    {
        name: "LA SPA"
    },
    {
        name: "TOURS",
        elements: ["All Destinations", "Visa On Arrival", "Transfer Services"]
    },
    {
        name: "GALLERY"
    },
    {
        name: "LOCATION & MAP"
    },
    {
        name: "LEGAL POLICY"
    }, 
    {
        name: "BEST RATE GUARANTEE"
    }, 
    {
        name: "ABOUT EHG"
    }, 
    {
        name: "CONTACT US"
    },
    {
        name: "OUR PROPERTIES",
        elements: hotelBranches.map(branch => branch.name)
    }
];

const MobileNavigation = () => {
  return (
    <Sheet>
        <SheetTrigger>
            <Menu width={30} height={30} className='z-90'/>
        </SheetTrigger>
        <SheetContent side='left' className='z-200 w-[300px]'>
            <SheetHeader>
                <SheetTitle className='text-2xl mb-4'>La Sieste</SheetTitle>
                
                <div className='text-[#242422]'>
                    {mobileNavigationItems.map((item, index) => (
                        <div key={index} className='playfair text-[14px] py-2 border-b-1'>
                            {item.elements ? (
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className='hover:text-[#BF882E] p-0 transition-colors duration-300 cursor-pointer'>{item.name}</AccordionTrigger>
                                        <AccordionContent className='p-0'>
                                            <div className='py-2'> 
                                                {item.elements.map((element, index) => (
                                                    <div 
                                                        key={index} 
                                                        className='hover:text-[#BF882E] py-1 transition-colors duration-300 cursor-pointer'
                                                    >
                                                        <Link href={`/${element.toString().toLowerCase().replace(/ /g, '-')}`}> 
                                                            {element.toString()}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <Link href={item.name} className='hover:text-[#BF882E] transition-colors duration-300 cursor-pointer'>
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </SheetHeader>
        </SheetContent>
    </Sheet>
  )
}

export default MobileNavigation