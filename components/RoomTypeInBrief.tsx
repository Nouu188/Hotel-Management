"use client";

import React from 'react'
import ImagesCarousel from './ImageCarousel'
import { ArrowRight, Bath, Bed, Cigarette, Image, Scaling, UserPlus } from 'lucide-react'
import BookARoomButton from './BookARoomButton'
import { Button } from './ui/button'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { generateSegmentFromLabel, removeLastSegment } from './Breadcrumbs'

export interface RoomTypeInBriefProps {
    name: string,
    imgUrl?: string[];
    altText?: string;
    price: string,
    description: string,
    roomSize: string,
    bedTypes: string,
    maxOccupancy: string,
    view: string,
    smoking: string,
    bathTypes: string,
}

const RoomTypeInBrief = ( item: RoomTypeInBriefProps ) => {
  const pathname = usePathname();
  let plannedPathname = removeLastSegment(pathname);

  if(pathname !== plannedPathname) {
    plannedPathname = pathname;

  }
  const router = useRouter();

  return (
    <div className="flex-1 max-w-125">
        <ImagesCarousel imgUrl={item.imgUrl} altText={item.altText} height="h-80" width="max-w-125"/>
        <div className="flex justify-center">
            <div className="border-b-1 text-center border-[#BF882E] p-3 px-12">
                <h2 className="font-semibold text-[16px]">{item.name}</h2>
                <h3 className="text-[14px]">Available from USD{item.price}</h3>
            </div>
        </div>

        <p className="text-center text-[14px] pt-3">{item.description}</p>

        <div className='space-y-1 grid grid-cols-2 p-3 text-[14px]'>
            <div className='flex items-center gap-1'>
                <Scaling width={14} height={14}/>
                Room size: {item.roomSize}
            </div>
            <div className='flex items-center gap-1'>
                <Image width={15} height={15}/>
                View:{item.view}
            </div>
            <div className='flex items-start gap-1'>
                <Bed width={19} height={19}/>
                Beds: {item.bedTypes}
            </div>           
            <div className='flex items-center gap-1'>
                <Cigarette width={16} height={16}/>
                Smoking: {item.smoking}
            </div>
            <div className='flex items-center gap-1'>
                <UserPlus width={14} height={14}/>
                Max occupancy: {item.maxOccupancy}
            </div>
            <div className='flex items-start gap-1'>
                <Bath width={17} height={17}/>
                Bathroom: {item.bathTypes}
            </div>
        </div>      

        <div className="flex justify-center gap-5">
            <BookARoomButton />   
            <Button onClick={() => {
                router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${plannedPathname}/${generateSegmentFromLabel(item.name)}`)
            }} className="hover:text-white hover:bg-[#bf882e] hover:border-[#bf882e] text-[12px] max-h-[32px] cursor-pointer rounded-none bg-transparent text-gray-700 border-1 border-black">
                More Info
                <ArrowRight/>
            </Button> 
        </div>      
    </div>
  )
}

export default RoomTypeInBrief