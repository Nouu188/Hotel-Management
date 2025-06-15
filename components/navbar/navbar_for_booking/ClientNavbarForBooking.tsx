"use client";

import { RootState } from '@/store/store'
import Image from 'next/image';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MobileNavigationForBooking from './MobileNavigationForBooking';
import Link from 'next/link';
import ROUTES from '@/constants/route';

const ClientNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const selectedBranch = useSelector((state: RootState) => state.filterHotelRoomType.selectedBranch);

  const handleMenuOpen = (isOpen: boolean) => {
    setIsMobileMenuOpen(isMobileMenuOpen);
  };

  return (
    <div className='bg-[#077dab] h-[58px] flex items-center sticky top-0 left-0 w-full z-100'>
      <div className={'lg:flex lg:justify-between justify-start w-full text-white font-mono raleway text-[18px] lg:mx-24'}>
        <div className='flex max-lg:items-center max-lg:px-4'>
          <MobileNavigationForBooking onMenuOpen={handleMenuOpen}/>
          <div className='flex items-center gap-4 lg:border-r-[0.5px] lg:border-white px-4'>
            <Link className='whitespace-nowrap' href={ROUTES.HOME}>{selectedBranch}</Link>
            <div className='flex '>
              {Array.from({ length: 5 }, (_, index) => (
                <Image
                  key={index}
                  src="/icons/star.svg"
                  width={12}
                  height={12}
                  alt="star"
                />
              ))}
            </div>
          </div>

          <div className='gap-8 flex items-center px-4 max-lg:hidden'>
            <div>Availability</div>
            <div>About</div>
            <div>Contact</div>
            <div>Policies</div>
          </div>
        </div>

        <div className='flex items-center max-lg:hidden'>
          <div className='border-r-1 border-white px-2'>VND</div>
          <div className='px-2'>English</div>
        </div>
      </div>
    </div>
  )
}

export default ClientNavbar