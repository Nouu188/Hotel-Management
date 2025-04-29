import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { navLinks } from '@/constants/navLinks'
import Link from 'next/link'
import Image from 'next/image'

const MobileNavigation = () => {
  return (
    <Sheet>
        <SheetTrigger>
            <Menu width={30} height={30}/>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader>
                <SheetTitle className='text-2xl'>HooTEL - WELCOME</SheetTitle>
                <SheetDescription>

                </SheetDescription>
                
                <div className='space-y-4 mt-4'>
                    {navLinks.map((item, index) => (
                        <Link key={index} className='flex gap-2 text-2xl py-4 border-b-1' href={item.route}>
                            <Image src={item.imgURL} width={20} height={20} alt={`${item.label}`}/>
                            {item.label}
                        </Link>
                    ))}
                </div>

            </SheetHeader>
        </SheetContent>
    </Sheet>
  )
}

export default MobileNavigation