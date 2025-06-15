"use client";

import { cn } from '@/lib/utils';
import { RootState } from '@/store/store'
import Image from 'next/image';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const RoomSelectedBookingSection = () => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const toggleExpand = (id: string) => {
    setExpanded(prev => ({
        ...prev,
        [id]: !prev[id],
    }));
    };

  const selectedHotelRoomTypes = useSelector((state: RootState) => state.selectedHotelRoomTypes.selectedInstances);

  return (
    <div className='space-y-4 flex flex-col justify-end'>
        {selectedHotelRoomTypes.map((item) => (
            <div key={item.instanceId} className="pb-4 max-w-[620px] flex flex-col border-1 border-[#b4b2b2] bg-white rounded-sm shadow">
                <div className="flex gap-3">
                    <div className="w-[200px] h-[160px] relative shrink-0">
                        <Image
                            src="/images/8.jpg"
                            fill
                            alt="room"
                            className="object-cover rounded-tl-sm"
                        />
                    </div>
                    
                    <div className='flex flex-col space-y-2'>
                        <h3 className="font-semibold text-[18px] text-[#333333] mt-1">{item.originalRoomData.roomType.name}</h3>
                        
                        <div className='flex gap-2 text-[#56595E] text-sm'>
                            <div className='flex gap-1'>
                                <Image src="/icons/adult.svg" width={14} height={14} alt='capacity'/>
                                <p>Sleeps {item.originalRoomData.roomType.capacity}</p>
                            </div>

                            <div className='flex gap-1'>
                                <Image src="/icons/bed.svg" width={16} height={16} alt='bed' />
                                <p className='flex'>{item.originalRoomData.roomType.bedNumb} {item.originalRoomData.roomType.bedType}</p>
                            </div>

                            <div className='flex gap-1'>
                                <Image src="/icons/bath.svg" width={16} height={16} alt='bath' />
                                <p>{item.originalRoomData.roomType.bathNumb} Bathrooms</p>
                            </div>
                        </div>

                        <div className='pr-1'>
                            <p className="text-[13px] text-gray-700">
                                {item.originalRoomData.roomType.description?.length > 150 ? (
                                    <>
                                        {item.originalRoomData.roomType.area}m²
                                        {expanded[item.originalRoomData.id]
                                            ? item.originalRoomData.roomType.description
                                            : item.originalRoomData.roomType.description.slice(0, 220) + '...'}
                                        <br/>
                                        <button
                                            onClick={() => toggleExpand(item.originalRoomData.id)}
                                            className="text-[#56595E] underline text-sm"
                                        >
                                            {expanded[item.originalRoomData.id] ? 'Less Info' : 'More Info'}
                                        </button>
                                    </>
                                ) : (
                                    item.originalRoomData.roomType.description
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-end gap-2 mr-6'>
                    <p className='line-through flex justify-end whitespace-nowrap text-[12px] text-[#333333]'>VND 6,075,622</p>
                    <p className='whitespace-nowrap text-black text-[15px] flex justify-end font-semibold'>VND {item.originalRoomData.roomType.price.toLocaleString()}</p>
                </div>
            </div>
        ))}
    </div>
  )
}

export default RoomSelectedBookingSection