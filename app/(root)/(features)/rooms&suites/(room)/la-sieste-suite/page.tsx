"use client";

import BookARoomButton from '@/components/BookARoomButton';
import ImagesCarousel from '@/components/ImageCarousel'
import { roomTypeInBrief } from '@/constants/roomTypeInBrief';
import { Bath, Bed, Cigarette, Eye as ImageIconLucide, Scaling, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <div className='flex-col justify-center lg:min-w-[1017px] w-full'>
        <section className='flex flex-grow items-center mb-6'>
            <div className='flex-1'></div>
            <h1 className='playfair flex-shrink-0 text-[#081746] text-[34px]'>La Siesta Suite</h1>
            <div className='flex-1 flex justify-end'>
                <BookARoomButton />
            </div>
        </section>
        <section className='relative'>
            <div className='absolute max-w-[272px] h-[368px] translate-y-15 bg-gray-100 z-10 text-black raleway font-light text-[14px] p-4'>
                <h2 className='font-normal mb-3'>Available from USD600</h2>
                <p className='mb-3'>Elegant suite room with spacious balcony, where we arrange outdoor table and chairs for your relaxation time.</p>
                
                <div className='space-y-1'>
                    <div className='flex items-center gap-1'>
                        <Scaling width={14} height={14}/>
                        Room size: 75 sqm
                    </div>
                    <div className='flex items-center gap-1'>
                        <ImageIconLucide width={14} height={14}/> 
                        View: City streets or rooftops
                    </div>
                    <div className='flex items-start gap-1'>
                        <Bed width={19} height={19}/>
                        Beds: Hollywood twins (allows 1 double or 2 twin beds)
                    </div>         
                    <div className='flex items-center gap-1'>
                        <Cigarette width={15} height={15}/>
                        Smoking: No
                    </div>
                    <div className='flex items-center gap-1'>
                        <UserPlus width={14} height={14}/>
                        Max occupancy: 2 pax
                    </div>
                    <div className='flex items-start gap-1'>
                        <Bath width={14} height={14}/>
                        Bathroom: Separate toilet, washbasin and walk-in shower
                    </div>
                </div>
            </div>
            
            <ImagesCarousel imgUrl={roomTypeInBrief[6].imgUrl} altText={roomTypeInBrief[6].altText} height='h-120' width='max-w-205'/>
        </section>

        <section className='py-8 border-b-1'>
            <h1 className='playfair text-[34px] text-[#081746] text-center pb-4'>Features</h1>
            <div className='font-light text-[14px]'>Elegant suite room with spacious balcony, where we arrange outdoor table and chairs for your relaxation time.
                <div className='pt-2 ml-8'>
                    <li>Light and airy La Siesta Suites configured as adjoining rooms connected via a small private corridor.</li>
                    <li>This accommodation is ideal for families and groups of friends.</li>
                    <li>En-suite bathroom split into three separate sections – walk in shower, toilet and washbasin alcove.</li>
                    <li>Large French patio doors open onto a spacious and deep 15m2 grand balcony with garden furniture, trees and shrubs, overlooking the city streets and rooftops.</li>
                </div>
            </div>
        </section>
        <section className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-5'>
            <div className='font-light text-[14px]'>
                <h1 className='font-medium text-base mb-2'>Suite Highlights</h1>
                <ul className='space-y-1 list-disc list-inside pl-5'>
                    <li>Spacious balcony & city view</li>
                    <li>Daily complimentary full hot breakfast</li>
                    <li>Daily housekeeping & turndown service</li>
                    <li>Electronic safe deposit box</li>
                    <li>Coffee Maker</li>
                </ul>
            </div>

            <div className='font-light text-[14px]'>
                <h1 className='font-medium text-base mb-2'>Technology</h1>
                <ul className='space-y-1 list-disc list-inside pl-5'>
                    <li>43’’ flat screen Internet TV</li>
                    <li>IDD telephone</li>
                    <li>FREE Highspeed Wireless internet access</li>
                    <li>Refrigerator & Minibar</li>
                    <li>Central air-conditioning with Digital individual climate control</li>
                    <li>Electrical adaptor</li>
                </ul>
            </div>

            <div className='font-light text-[14px]'>
                <h1 className='font-medium text-base mb-2'>Bed & Bath</h1>
                <ul className='space-y-1 list-disc list-inside pl-5'>
                    <li>1 King bed or 02 single beds</li>
                    <li>Separate toilet, washbasin and standing shower and Bathtub.</li>
                    <li>Bathrobe.</li> 
                    <li>Iron & ironing board</li>
                    <li>Weighing scale</li>
                    <li>Hair dryer</li>
                    <li>Shaver outlet (220 volts)</li>
                    <li>Deluxe toiletries</li>
                    <li>Make up/shaving mirror</li>
                    <li>Alarm clock</li>
                </ul>
            </div>
            <div className='font-light text-[14px]'>
                <h1 className='font-medium text-base mb-2'>Others</h1>
                <ul className='space-y-1 list-disc list-inside pl-5'>
                    <li>Welcome drinks</li>
                    <li>Orientation map</li>
                    <li>Coffe table & chair</li>
                    <li>Tea bags & coffee making facilities</li>
                    <li>Pets not allowed</li>
                </ul>
            </div>
        </section>
    </div>
  )
}

export default Page;