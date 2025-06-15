"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { HotelBranchRoomTypeFilterSectionSkeleton } from './HotelBranchRoomTypeFilterSkeleton';
import { useRoomTypeFilter } from './use-branchRoomTypeFilter';

export function calculatePriceByNights(price: number, numberOfNights: number | string, ): number | string {
  const nights = numberOfNights as number;
  const totalPrice = price * nights;

  return totalPrice;
}

const HotelBranchRoomTypeFilterSection = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const {
    roomTypes,
    loading,
    fromDate,
    toDate,
    numberOfNights,
    selectedHotelRoomTypes,
    handleOnSelect,
    handleAddSelectedHotelRoomTypes
  } = useRoomTypeFilter();

  if(!fromDate || !toDate) {
    return "Invalid date format for fromDate or toDate."
  }

  return (
    <div className="bg-[#eff8fc] text-[#56595E]">
      {loading ? (
        <HotelBranchRoomTypeFilterSectionSkeleton />
      ) : (
        <div className="flex raleway flex-col gap-4 max-md:mx-2">
          {roomTypes.map((item, index) => {
            const countRoomTypeSelected = selectedHotelRoomTypes.filter(selectedRoomType => selectedRoomType.originalRoomData.id === item.id).length;
            const isFullySelected = item.remainingQuantity > 0 && countRoomTypeSelected >= item.remainingQuantity;

            return (
              <div key={index} className={("max-w-[695px] flex flex-col border-1 border-[#b4b2b2] bg-white rounded-sm shadow")}>
                  <div className={("border-b-1 border-[#b4b2b2] pb-4 flex gap-3 max-md:flex-col")}>
                      <div className="lg:w-[300px] lg:h-[200px] md:w-[260px] md:h-[180px] max-md:h-120 overflow-hidden w-full h-full rounded-tl-sm group relative shrink-0">
                          <Image
                            src="/images/8.jpg"
                            fill
                            alt="room"
                            className="object-cover transform group-hover:scale-105 overflow-hidden transition-transform duration-500 ease-in-out"
                          />
                      </div>
                      
                      <div className='flex flex-col space-y-2 md:pt-2 max-md:px-4'>
                          <h3 className="font-semibold text-xl text-[#333333] mb-2">{item.roomType.name}</h3>
                          
                          <div className='flex gap-4 text-[#56595E]'>
                              <div className='flex gap-1'>
                                  <Image src="/icons/adult.svg" width={14} height={14} alt='capacity'/>
                                  <p>Sleeps {item.roomType.capacity}</p>
                              </div>

                              <div className='flex gap-1'>
                                  <Image src="/icons/bed.svg" width={16} height={16} alt='bed' />
                                  <p className='flex'>{item.roomType.bedNumb} {item.roomType.bedType}</p>
                              </div>

                              <div className='flex gap-1'>
                                  <Image src="/icons/bath.svg" width={16} height={16} alt='bath' />
                                  <p>{item.roomType.bathNumb} Bathrooms</p>
                              </div>
                          </div>

                          <div className='md:pr-1'>
                              <p className="text-md text-gray-700">
                                  {item.roomType.description?.length > 150 ? (
                                      <>
                                          {item.roomType.area}m²
                                          {expanded[item.id]
                                              ? item.roomType.description
                                              : item.roomType.description.slice(0, 170) + '...'}
                                          <br/>
                                          <button
                                              onClick={() => toggleExpand(item.id)}
                                              className="text-[#56595E] underline text-sm"
                                          >
                                              {expanded[item.id] ? 'Less Info' : 'More Info'}
                                          </button>
                                      </>
                                  ) : (
                                      item.roomType.description
                                  )}
                              </p>
                          </div>
                      </div>
                  </div>
                  {item.availabilityStatus === "sold_out" ? (
                    <div className='flex justify-center bg-[#3333330f] space-y-6 py-10 items-center flex-col'>
                      <div className='flex items-center text-sm gap-1'>
                        <p className='font-semibold text-[#333333]'>{format(fromDate, 'eee, d MMM yy')} - {format(toDate, 'eee, d MMM yy')}</p>
                        are unavailable
                      </div>

                      <div>
                        <Button className='bg-white group border-1 scale-105 border-[#b4b2b2] hover:bg-[#006e96] hover:border-none rounded-sm'>
                          <Calendar className='group-hover:text-white text-[#333333]'/>
                          <p className='font-semibold text-md group-hover:text-white text-[#333333]'>Find available dates</p>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={cn(handleOnSelect(item.id) && item.remainingQuantity > 0 ? "border-[#077dab] border-2" : "", item.remainingQuantity <= 0 ? "justify-end pb-4 px-4" : "justify-between p-4", ` flex`)}>
                      {item.remainingQuantity > 0 && (
                        <section className='text-[14px] md:text-[15px]'>
                          <h3 className="font-semibold text-[16px] md:text-[18px] text-[#333333] mb-1">Non-Refundable-Best Price Guarantee</h3>
                          <div className='text-[#0E7A06] flex items-start gap-1'>
                            <Image src="/icons/check.svg" className='translate-y-0.5' width={18} height={18} alt='check'/>
                            Daily Buffet Breakfast & Welcome Drink & Daily Mineral Water
                          </div>
                          
                          <div className='text-[#0E7A06] flex items-start gap-1'>
                            <Image src="/icons/check.svg" className='translate-y-0.5' width={18} height={18} alt='check'/>
                            Free Swimming Pool & Gym Access
                          </div>

                          <div className='text-[#0E7A06] flex items-start gap-1'>
                            <Image src="/icons/check.svg" className='translate-y-0.5' width={18} height={18} alt='check'/>
                            10% off F&B, 15% off Spa (from 60 mins), 30% off Laundry service
                          </div>

                          <div className='text-[#0E7A06] flex items-start gap-1'>
                            <Image src="/icons/check.svg" className='translate-y-0.5' width={18} height={18} alt='check'/>
                            Free Upgrade & Early Check-in (Subject To Room Availability, NON-GUARANTEED)
                          </div>

                          <div className='text-[#0E7A06] flex items-start gap-1'>
                            <Image src="/icons/check.svg" className='translate-y-0.5' width={18} height={18} alt='check'/>
                            Daily Buffet Breakfast & Welcome Drink & Daily Mineral Water
                          </div>

                          <div className='text-[#333333] flex gap-1'>
                            <Image src="/icons/warning.svg" width={20} height={20} alt='check'/>
                            Non-refundable
                          </div>

                          <div className='text-[#333333] flex gap-1'>
                            <Image src="/icons/warning.svg" width={20} height={20} alt='check'/>
                            Pay today
                          </div>

                          <p className='text-[#066186] mt-3'>More info</p>
                        </section>
                      )}
                      
                      {isFullySelected ? (
                        <section className='text-[#0E7A06] flex items-end whitespace-nowrap mb-1'>
                          <div className='bg-[#c0e5bd] font-semibold text-[14px] rounded-xs p-1 px-[5px]'>You selected the last one</div>
                        </section>
                      ) : (
                        <section className='flex flex-col justify-end items-end'>
                          {item.remainingQuantity < 5 && (
                            <p className='text-[#CD4242] font-medium text-[13px] md:pb-2'>ONLY {item.remainingQuantity} LEFT</p>
                          )}
                          <div className='flex max-md:flex-col md:gap-4 gap-1'>
                            <div className={`${item.remainingQuantity <= 0 ? "items-center gap-3" : "flex-col"} flex`}>
                              <p className='line-through flex justify-end whitespace-nowrap text-[14px] text-[#333333]'>VND 6,075,622</p>
                              <h2 className='whitespace-nowrap text-black flex justify-end font-semibold'>VND {calculatePriceByNights(item.roomType.price, numberOfNights).toLocaleString()}</h2>
                              {item.remainingQuantity > 0 && (<p className='whitespace-nowrap text-[#333333] max-md:hidden'>Cost for {numberOfNights} night, {item.roomType.capacity} guests</p>)}
                            </div>
                            
                            {item.remainingQuantity > 0 && (
                              <div className='flex md:items-end justify-end'>
                                  <Button 
                                    className='bg-[#077dab] hover:bg-[#077fabe6] md:-translate-y-[3px] text-[17px] rounded-sm max-md:w-full px-6 py-5'
                                    onClick={() => {
                                      handleAddSelectedHotelRoomTypes(item)
                                    }}
                                  >
                                    Select
                                  </Button> 
                              </div>
                            )}
                          </div>
                        </section>
                      )}
                    </div>
                  )}
              </div>
            )})}
          </div>
      )}
    </div>
  );
};

export default HotelBranchRoomTypeFilterSection;
