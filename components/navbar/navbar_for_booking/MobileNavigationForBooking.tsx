import React, { useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, X } from 'lucide-react'

interface MobileNavigationForBookingProps {
    onMenuOpen: (isOpen: boolean) => void; 
}

const MobileNavigationForBooking: React.FC<MobileNavigationForBookingProps> = ({ onMenuOpen }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='z-100 lg:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger 
          onClick={() => {
            setOpen(!open)
            onMenuOpen
          }} 
          className='flex items-center z-100'
          asChild
        >
          {open ? (
            <X width={30} height={30} className='z-100 duration-300 transi'/>
          ) : (
            <Menu width={30} height={30} className='z-100'/>
          )}
        </SheetTrigger>
        
        <SheetContent side='top' className='bg-[#077dab] min-w-screen min-h-screen item translate-y-14 flex-col justify-between'>
          <SheetTitle className='text-white text-[19px] font-normal lg:hidden max-w-[99%]'>
            <div className='px-4'>
              <div className='py-2'>Home</div>
              <div className='py-2 border-b-1'>Availability</div>
              <div className='py-2'>About</div>
              <div className='py-2'>Contact</div>
              <div className='py-2'>Policies</div>            
            </div>
          </SheetTitle>

          <SheetTitle className='mt-58 text-white text-[19px] font-normal -translate-y-14 lg:hidden max-w-[99%] px-4'>
              <div className='py-2 border-b-1'>Setting</div>
              <div className='flex justify-between py-2'>
                <p>Language</p>
                <p>English</p>
              </div>
              <div className='flex justify-between py-2'>
                <p>Currency</p>
                <p>VND</p>
              </div>
          </SheetTitle>
        </SheetContent>
    </Sheet>
    </div>
  )
}

export default MobileNavigationForBooking