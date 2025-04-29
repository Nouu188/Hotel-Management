"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Prisma, RoomStatus } from '@prisma/client';
import { ActionResponseForArray } from '@/types/global';
import Image from 'next/image';
import { Button } from './ui/button';
import { calculateNights } from './BillSearchingSection';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';

const roomWithDetailsArgs = Prisma.validator<Prisma.RoomDefaultArgs>()({
  include: {
    hotel: true,       
    roomIndetail: true 
  },
});

interface RoomSectionProps {
  onRoomSelect?: (room: RoomInDetails) => void,
  roomSelected: RoomInDetails[],
  booking?: boolean,
}

export type RoomInDetails = Prisma.RoomGetPayload<typeof roomWithDetailsArgs>;
export interface BookingItem {
  roomData: RoomInDetails;
  guestAllocation: {
    adults: number;
    children: number;
    infants: number;
  };
}

export function calculatePriceByNights(price: number, numberOfNights: number | string, ): number | string {
  const nights = numberOfNights as number;
  const totalPrice = price * nights;

  return totalPrice;
}

const RoomSearchingSection: React.FC<RoomSectionProps> = ({ onRoomSelect, roomSelected, booking }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState<RoomInDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const branch = searchParams.get('branch');
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  if(!fromDate || !toDate) {
    return "fromDate or toDate or onRoomSelect is null"
  }
  const numberOfNights = calculateNights(fromDate, toDate);

  const handleOnSelect = (roomId: string) => {
    const result = roomSelected.find(item => item.id === roomId);

    return result;
  }

  useEffect(() => {
    const items: { adults: number; children: number; infants: number }[] = [];
    for (const [key, value] of searchParams.entries()) {
      const match = key.match(/^items\[(\d+)]\[(\w+)]$/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2] as keyof typeof items[number]; 
        if (!items[index]) items[index] = { adults: 0, children: 0, infants: 0 };

        items[index][field] = Number(value) || 0;
      }
    }

    if (!branch || items.length === 0) {
        setRooms([]);
        return;
    };

    const fetchRooms = async () => {
      setLoading(true);

      try {
        if(booking) {
          setRooms(roomSelected);
          return;
        }
        const res = await api.rooms.getByFilter(branch, items) as ActionResponseForArray<RoomInDetails>;

        if (res.success && res.data) {
          setRooms(res.data);
        } else {
          console.error("API call failed or returned no data:");
          setRooms([]); 
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchParams])

  return (
    <div className="bg-[#eff8fc] text-[#56595E]">
      {loading ? (
        <div className='flex justify-center '>
          <p className='mr-40'>Loading rooms...</p>
        </div>
      ) : rooms.length == 0 ? (
        <div className='flex justify-center '>
          <p className='mr-40'>No rooms found.</p>
        </div>
      ) : (
        <div className="flex raleway flex-col gap-4">
          {rooms.map((room, index) => (
            <div key={index} className={cn(booking ? "max-w-[680px]" : "max-w-[790px] ", "flex flex-col border-1 border-[#b4b2b2] bg-white rounded-sm shadow")}>
                <div className={cn(booking ? "" : "border-b-1 border-[#b4b2b2] pb-4", "flex gap-3  ")}>
                    <div className="w-[300px] h-[200px] relative shrink-0">
                        <Image
                          src="/images/8.jpg"
                          fill
                          alt="room"
                          className="object-cover rounded-tl-md"
                        />
                    </div>
                    
                    <div className='flex flex-col space-y-2'>
                        <h3 className="font-semibold text-xl text-[#333333] mt-3">{room.roomIndetail.name}</h3>
                        
                        <div className='flex gap-4 text-[#56595E]'>
                            <div className='flex gap-1'>
                                <Image src="/icons/adult.svg" width={14} height={14} alt='capacity'/>
                                <p>Sleeps {room.roomIndetail.capacity}</p>
                            </div>

                            <div className='flex gap-1'>
                                <Image src="/icons/bed.svg" width={16} height={16} alt='bed' />
                                <p className='flex'>{room.roomIndetail.bedNumb} {room.roomIndetail.bedType}</p>
                            </div>

                            <div className='flex gap-1'>
                                <Image src="/icons/bath.svg" width={16} height={16} alt='bath' />
                                <p>{room.roomIndetail.bathNumb} Bathrooms</p>
                            </div>
                        </div>

                        <div className='pr-1'>
                            <p className="text-md text-gray-700">
                                {room.roomIndetail.description.length > 150 ? (
                                    <>
                                        {room.roomIndetail.area}m²
                                        {expanded[room.id]
                                            ? room.roomIndetail.description
                                            : room.roomIndetail.description.slice(0, 220) + '...'}
                                        <br/>
                                        <button
                                            onClick={() => toggleExpand(room.id)}
                                            className="text-[#56595E] underline text-sm"
                                        >
                                            {expanded[room.id] ? 'Less Info' : 'More Info'}
                                        </button>
                                    </>
                                ) : (
                                    room.roomIndetail.description
                                )}
                            </p>
                        </div>
                    </div>
                </div>
              {room.status === RoomStatus.BOOKED ? (
                <div className='flex justify-center bg-[#3333330f] space-y-6 py-10 items-center flex-col'>
                  <div className='flex items-center text-md gap-1'>
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
                <div className={cn(handleOnSelect(room.id) && !booking ? "border-[#077dab] border-2" : "", booking ? "justify-end pb-4 px-4" : "justify-between p-4", ` flex`)}>
                  {!booking && (
                    <section className='text-[15px]'>
                      <h3 className="font-semibold text-[18px] text-[#333333] mb-1">Non-Refundable-Best Price Guarantee</h3>
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
                  
                  <section className='flex items-end'>
                    <div className='flex gap-4'>
                      <div className={`${booking ? "items-center gap-3" : "flex-col"} flex`}>
                        <p className='line-through flex justify-end whitespace-nowrap text-[14px] text-[#333333]'>VND 6,075,622</p>
                        <h2 className='whitespace-nowrap text-black flex justify-end font-semibold'>VND {calculatePriceByNights(room.roomIndetail.price, numberOfNights).toLocaleString()}</h2>
                        {!booking && (<p className='whitespace-nowrap text-[#333333]'>Cost for {numberOfNights} night, {room.roomIndetail.capacity} guests</p>)}
                      </div>
                      
                      {!booking && (
                        <div className='flex items-end'>
                          {onRoomSelect && (
                            <Button 
                              className='bg-[#077dab] hover:bg-[#077fabe6] -translate-y-[3px] text-[17px] rounded-sm px-6 py-5'
                              onClick={() => {
                                onRoomSelect(room);
                              }}
                            >
                              Select
                            </Button> 
                          )}

                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomSearchingSection;
