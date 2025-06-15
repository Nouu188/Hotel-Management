"use client";

import BookARoomButton from '@/components/BookARoomButton';
import ImagesCarousel from '@/components/ImageCarousel'
import { roomTypeInBrief } from '@/constants/roomTypeInBrief';
import { Bath, Bed, Cigarette, Image, Scaling, UserPlus } from 'lucide-react'

const Page = () => {
  return (
    <div className='flex-col justify-center lg:min-w-[1017px] w-full'>
        <section className='flex flex-grow items-center mb-6'>
            <div className='flex-1'></div>
            <h1 className='playfair flex-shrink-0 text-[#081746] text-[34px]'>Deluxe Room</h1>
            <div className='flex-1 flex justify-end'>
                <BookARoomButton />
            </div>
        </section>
        <section className='relative'>
            <div className='absolute max-w-[272px] h-[368px] translate-y-15 bg-gray-100 z-10 text-black raleway font-light text-[14px] p-4'>
                <h2 className='font-normal mb-3'>Available from USD195</h2>
                <p className='mb-3'>Elegant and refined, the Deluxe Room completes your stay with luxurious amenities.</p>
                
                <div className='space-y-1'>
                    <div className='flex items-center gap-1'>
                        <Scaling width={14} height={14}/>
                        Room size: 22 - 25 sqm
                    </div>
                    <div className='flex items-center gap-1'>
                        <Image width={14} height={14}/>
                        View: Limited view
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
                        Bathroom: Toilet, washbasin and bathtub
                    </div>
                </div>
            </div>
            
            <ImagesCarousel imgUrl={roomTypeInBrief[2].imgUrl} altText={roomTypeInBrief[2].altText} height='h-120' width='max-w-205'/>
        </section>

        <section className='py-8 border-b-1'>
            <h1 className='playfair text-[34px] text-[#081746] text-center pb-4'>Features</h1>
            <p className='font-light text-[14px]'>Elegant and refined, the Deluxe Room completes your stay with luxurious amenities</p>
        </section>

        <section className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-5'>
            <div className='font-light text-[14px]'>
                <h1 className='font-medium text-base mb-2'>Highlights</h1> 
                <ul className='space-y-1 list-disc list-inside'> 
                    <li>Daily complimentary full hot breakfast</li>
                    <li>Daily housekeeping & turndown service</li>
                    <li>Quiet, double glazed glass windows</li>
                    <li>Electronic safe deposit box</li>
                </ul>
            </div>

            <div className='font-light text-[14px]'>
                <h1 className='font-medium text-base mb-2'>Technology</h1>
                <ul className='space-y-1 list-disc list-inside'>
                    <li>43’’ flat screen Internet TV</li>
                    <li>IDD telephone</li>
                    <li>FREE High Speed Wireless internet access</li>
                    <li>Refrigerator & Minibar</li>
                    <li>Central air-conditioning with Digital individual climate control</li>
                    <li>Electrical adaptor</li>
                </ul>
            </div>

            <div className='font-light text-[14px]'>
                <h1 className='font-medium text-base mb-2'>Bed & Bath</h1>
                <ul className='space-y-1 list-disc list-inside'>
                    <li>1 King bed or 02 single beds</li>
                    <li>Standing shower</li>
                    <li>Bathrobe</li>
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
                <ul className='space-y-1 list-disc list-inside'>
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

export default Page