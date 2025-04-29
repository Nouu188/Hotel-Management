import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from './ui/button';
import { calculatePriceByNights, RoomInDetails } from './RoomSearchingSection'
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from "date-fns"
import { useState } from 'react';

export function calculateNights(fromDate: string, toDate: string): number | string {
  const fromDateTime = new Date(fromDate);
  const toDateTime = new Date(toDate);

  if(fromDateTime >= toDateTime) {
    return "fromDate must be after toDate";
  }

  const diffMiliseconds = toDateTime.getTime() - fromDateTime.getTime();
  const diffDays = diffMiliseconds / (1000 * 60 *60 * 24);
  
  return Math.round(diffDays);
}

export function calculateTotalPrice (selectedRooms?: RoomInDetails[], numberOfNights?: number) {
  const totalPrice = selectedRooms?.reduce((sum, room) => {
    if(numberOfNights) {
      const price = room.roomIndetail.price * numberOfNights;
        return sum + price;
    }
    return 0;
  }, 0);

  return totalPrice;
}

interface BillSectionProps {
  selectedRooms: RoomInDetails[],
  onDeselect?: (roomId: string) => void,
  booking?: boolean,
}

const BillSearchingSection: React.FC<BillSectionProps> = ({ selectedRooms, onDeselect, booking }) => {
  const [expanded, setExpanded] = useState<boolean>(!booking);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const items: { adults: number; children: number; infants: number }[] = [];

  // Loop qua tất cả query keys để tìm các items
  for (const [key, value] of searchParams.entries()) {
    const match = key.match(/^items\[(\d+)]\[(\w+)]$/);
    if (match) {
      const index = parseInt(match[1]);
      const field = match[2];

      if (!items[index]) items[index] = { adults: 0, children: 0, infants: 0 };
      items[index][field as keyof typeof items[number]] = Number(value);
    }
  }

  const totalOfGuest = selectedRooms?.reduce(
    (sum) => sum + items[items.length - 1].adults + items[items.length - 1].children + items[items.length - 1].infants,
    0
  );

  const totalOfRooms = selectedRooms?.reduce(
    (sum) => sum + 1,
    0
  );

  if(!fromDate || !toDate) {
    return "fromDate or toDate is null"
  }
  const numberOfNights = calculateNights(fromDate, toDate);
  const totalPrice = calculateTotalPrice(selectedRooms, numberOfNights as number);

  const handleBooking = () => {
    if (selectedRooms.length === 0) return;

    try {
        const selectedRoomsString = JSON.stringify(selectedRooms);
        sessionStorage.setItem('selectedRoomInDetailss', selectedRoomsString);
        const currentQueryString = searchParams.toString();
        
        const targetUrl = `/book-directonline/book?${currentQueryString}`;
        router.push(targetUrl);
    } catch (error) {
        alert("An error occurred while preparing your booking. Please try again.");
    }
  };

  return (
    <div className={cn(booking ? "top-12" : "top-26", "w-[390px] raleway  sticky text-[16px] py-4 px-6 bg-white border-1 border-[#b4b2b2] rounded-sm")}>
      {totalPrice !== 0 ? (
        <p className='text-[#333333] font-semibold lato text-[20px] mb-5'>VND {totalPrice?.toLocaleString()} total</p>
      ) : (
        <></>
      )}
      
      <section className='border-b-1 border-[#b4b2b2] pb-2 space-y-3 text-[#333333] text-[16px] lato'>
        <div className='flex justify-between'>
          <p>{format(fromDate, 'eee, d MMM yy')} - {format(toDate, 'eee, d MMM yy')}</p>
          <p>{numberOfNights} night</p> 
        </div>

        <div>
          {totalOfRooms === 0 ? 1 : totalOfRooms} room{items.length > 1 ? "s" : ""}, {totalOfGuest === 0 ? 2 : totalOfGuest} guests
        </div> 
      </section>

      {booking && (
        <div>
          <button
            className='lato text-[17px] font-semibold text-[#333333] w-full mt-3 mb-1 flex justify-between cursor-pointer'
            onClick={() => setExpanded(!expanded)}
          >
            Stay details
            {expanded ? (
              <ChevronUp className='translate-y-1'/>
            ) : (
              <ChevronDown className='translate-y-1'/>
            )}
          </button>
        </div>

      )}
      {expanded && (<>
        <section className='flex flex-col justify-center'>
          {selectedRooms?.length === 0 ? (
            <p className='flex justify-center py-4'>Select a rate to continue</p>
          ) : (
            selectedRooms?.map((room, index) => (
              <section key={index} className='border-b-1 pt-4 pb-3'>
                <div className='flex justify-between'>
                  <div className='lato text-[17px] font-semibold text-[#333333]'>
                    {room.roomIndetail.name} - Non-Refundable - Best Price Guarantee
                  </div>
                  {onDeselect && (
                    <Button variant="ghost" onClick={() => onDeselect(room.id)} className='hover:bg-transparent -translate-y-1 translate-x-4'>
                      <Image src="/icons/trash.svg" width={16} height={16} alt='trash'/>
                    </Button>
                  )}

                </div>

                <div className='flex justify-between mt-4'>
                  <div className='text-[#717171] text-[15px] lato'>
                    {room.roomIndetail.capacity} guests, {numberOfNights} night
                    <p className='text-black'>Non-refundable</p>
                  </div>
                  <div className=''>
                    <p className='text-black lato text-[17px]'>VND {calculatePriceByNights(room.roomIndetail.price, numberOfNights).toLocaleString()}</p>
                    <p className='line-through text-[13px] lato text-[#717171] flex justify-end whitespace-nowrap'>VND 6,075,622</p>
                  </div>
                </div>

                <div className='flex gap-3 mt-3'>
                  <p className='text-[#066186] text-[16px]'>Room inclusions</p>
                  <ChevronDown className='text-[#066186] w-6 h-6 translate-y-0.5'/>
                </div>
              </section>
            ))
          )}
          
          <div>
              {totalPrice === 0 
                ? ("") 
                : (
                  <section className={cn(booking ? "pt-4" : "py-4", 'flex justify-between')}>
                    <div>
                      <p className='lato text-[17px] font-semibold text-[#333333]'>Total</p>
                      <p className='text-[#717171] text-[15px] lato'>Includes taxes and fees</p>
                    </div>

                    <p className='text-[#333333] lato text-[17px]'>
                      {totalPrice?.toLocaleString()}
                    </p>
                  </section>  
              )}
          </div>

          {!booking && (
            <Button onClick={handleBooking} className={cn(selectedRooms?.length === 0 ? "cursor-no-drop hover:bg-[#6792a3] bg-[#6b94a4]" : "bg-[#077dab] hover:bg-[#077fabe6]", " text-[20px] py-5 rounded-sm")}>
              Book
            </Button>
          )}
        </section>
      </>)}
    </div>
  )
}

export default BillSearchingSection