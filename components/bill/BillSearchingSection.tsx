"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isValid } from "date-fns"; 
import { useState } from 'react';
import { HotelBranchRoomTypeItem } from '@/types/roomType';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { removeSelectedRoomType, SelectedRoomInstance } from '@/store/slices/selectedHotelRoomTypesSlice';

export function calculateNights(fromDateStr: string, toDateStr: string): number {
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    if (!isValid(fromDate) || !isValid(toDate) || fromDate >= toDate) {
        return 0; 
    }
    const diffMiliseconds = toDate.getTime() - fromDate.getTime(); 
    const diffDays = diffMiliseconds / (1000 * 60 * 60 * 24);
    return Math.round(diffDays);
}

export function calculateTotalPrice(
    selectedRooms: SelectedRoomInstance[]  | undefined,
    numberOfNights: number
): number {
    if (!selectedRooms || numberOfNights <= 0) return 0;

    return selectedRooms.reduce((sum, item) => {
        const pricePerNight = item.originalRoomData.roomType?.price ?? 0;
        return sum + (pricePerNight * numberOfNights);
    }, 0);
}

export function calculateItemPrice(
    item: HotelBranchRoomTypeItem,
    numberOfNights: number
): number {
    if (numberOfNights <= 0) return 0;
    const pricePerNight = item.roomType?.price ?? 0;
    return pricePerNight * numberOfNights;
}

const BillSearchingSection = ({ booking }: { booking?: Boolean }) => {
    const [expanded, setExpanded] = useState<boolean>(true);   
    const [roomInclusionsExpanded, setRoomInclusionsExpanded] = useState<Record<string, boolean>>({});

    const toggleRoomInclusion = (roomId: string) => {
        setRoomInclusionsExpanded(prev => ({ ...prev, [roomId]: !prev[roomId] }));
    };
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();

    const guestAllocation = useSelector((state: RootState) => state.filterHotelRoomType.guestAllocation);
    const selectedHotelRoomTypes = useSelector((state: RootState) => state.selectedHotelRoomTypes.selectedInstances);

    const fromDateStr = searchParams.get("fromDate");
    const toDateStr = searchParams.get("toDate");

    const totalOfGuest = guestAllocation?.reduce(
        (sum, item) => sum + item.adults + item.children + item.infants,
        0
    ) ?? 0;

    const totalOfRooms = selectedHotelRoomTypes.length;

    if (!fromDateStr || !toDateStr) {
        return (
            <div className={cn("top-26", "w-[390px] raleway sticky text-[16px] py-4 px-6 bg-white border-1 border-[#b4b2b2] rounded-sm")}>
                Please select dates first.
            </div>
        );
    }
    
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);

    if (!isValid(fromDate) || !isValid(toDate)) {
         return (
            <div className={cn("top-26", "w-[390px] raleway sticky text-[16px] py-4 px-6 bg-white border-1 border-[#b4b2b2] rounded-sm")}>
                Invalid date format in URL.
            </div>
        );
    }

    const numberOfNights = calculateNights(fromDateStr, toDateStr);
    if (numberOfNights <= 0) {
         return (
            <div className={cn("top-26", "w-[390px] raleway sticky text-[16px] py-4 px-6 bg-white border-1 border-[#b4b2b2] rounded-sm")}>
                Date range must be at least 1 night.
            </div>
        );
    }

    const totalPrice = calculateTotalPrice(selectedHotelRoomTypes, numberOfNights);

    const handleDeselect = (roomId: string) => {
        dispatch(removeSelectedRoomType(roomId));
    };

    const handleBooking = () => {
        if (selectedHotelRoomTypes.length === 0) return;
        try {
            const currentQueryString = searchParams.toString();
            const targetUrl = `/book-directonline/book?${currentQueryString}`;

            router.push(targetUrl);
        } catch (error) {
            console.error("Booking Error:", error);
            alert("An error occurred while preparing your booking. Please try again.");
        }
    };

    return (
        <div className={cn("top-19", "lg:w-[300px] w-[270px] mb-[17px] raleway sticky text-[16px] py-4 px-5 bg-white border-1 border-[#b4b2b2] rounded-sm")}>
            {totalPrice > 0 && (
                <p className='text-[#333333] font-semibold lato text-[18px] mb-3'>VND {totalPrice.toLocaleString()} total</p>
            )}
            
            <section className='border-b-1 border-[#b4b2b2] md:gap-2 pb-2 space-y-3 text-[#333333] text-[14px] lato'>
                <div className='flex justify-between'>
                    <p>{format(fromDate, 'eee, d MMM yy')} - {format(toDate, 'eee, d MMM yy')}</p>
                    <p>{numberOfNights} night{numberOfNights !== 1 ? 's' : ''}</p> 
                </div>
                <div>
                    {totalOfRooms} room{totalOfRooms !== 1 ? "s" : ""}, {totalOfGuest} guest{totalOfGuest !== 1 ? 's' : ''}
                </div> 
            </section>

            {booking && (
              <button
                className='lato text-[15px] font-semibold text-[#333333] w-full mt-3 mb-1 flex justify-between cursor-pointer'
                onClick={() => setExpanded(!expanded)}
              >
                Stay details
                {expanded ? (
                  <ChevronUp className='translate-y-1'/>
                ) : (
                  <ChevronDown className='translate-y-1'/>
                )}
              </button>

            )}

            {expanded && (
              <section className='flex flex-col justify-center'>
                <div className={cn(selectedHotelRoomTypes.length > 1 && "pr-2", 'overflow-y-auto max-h-[430px]')}>
                  {selectedHotelRoomTypes.length === 0 ? (
                      <p className='flex justify-center py-3 text-[15px] text-[#717171]'>Select a room to continue</p>
                  ) : (
                      selectedHotelRoomTypes.map((item, index) => (
                          <section key={item.instanceId || index} className='border-b-1 pt-4 pb-3'>
                              <div className='flex justify-between items-start'>
                                  <div className='lato text-[15px] font-semibold text-[#333333] flex-1 pr-2'>
                                      {item.originalRoomData.roomType?.name ?? 'Room information unavailable'} - Non-Refundable - Best Price Guarantee
                                  </div>
                                  {!booking && (
                                    <Button variant="ghost" onClick={() => handleDeselect(item.instanceId)} className='hover:bg-red-100 hover:text-red-600 text-gray-500 -translate-y-1 flex-shrink-0 p-1 h-auto'>
                                        <Image src="/icons/trash.svg" width={16} height={16} alt='trash'/>
                                    </Button>
                                  )}
                              </div>

                              <div className='flex justify-between mt-2'>
                                  <div className='text-[#717171] text-[13px] lato'>
                                      {item.originalRoomData.roomType?.capacity ?? '?'} guests, {numberOfNights} night{numberOfNights !== 1 ? 's' : ''}
                                      <p className='text-black'>Non-refundable</p>
                                  </div>
                                  <div className='text-right'>
                                      <p className='text-black lato text-[15px]'>VND {calculateItemPrice(item.originalRoomData, numberOfNights).toLocaleString()}</p>
                                      <p className='line-through text-[13px] lato text-[#717171] flex justify-end whitespace-nowrap'>VND 6,075,622</p> 
                                  </div>
                              </div>

                              <div 
                                  className='flex gap-3 mt-2 items-center cursor-pointer group' 
                                  onClick={() => toggleRoomInclusion(item.originalRoomData.id)}
                              >
                                  <p className='text-[#066186] text-[14px] group-hover:underline'>Room inclusions</p>
                                  {roomInclusionsExpanded[item.originalRoomData.id] ? 
                                      <ChevronUp className='text-[#066186] w-5 h-5'/> : 
                                      <ChevronDown className='text-[#066186] w-5 h-5'/>}
                              </div>
                              {roomInclusionsExpanded[item.originalRoomData.id] && (
                                  <div className='text-sm text-gray-600 mt-2 pl-4 border-l-2 border-gray-200'>
                                      <p>- Daily Buffet Breakfast</p>
                                      <p>- Welcome Drink & Daily Mineral Water</p>
                                      <p>- Free Swimming Pool & Gym Access</p>
                                      <p>- 10% off F&B, 15% off Spa, 30% off Laundry</p>
                                  </div>
                              )}
                          </section>
                      ))
                  )}
                  
                  {totalPrice > 0 && (
                      <section className={`${!booking ? "py-4" : "pt-2"} flex justify-between`}>
                          <div>
                              <p className='lato text-[15px] font-semibold text-[#333333]'>Total</p>
                              <p className='text-[#717171] text-[13px] lato'>Includes taxes and fees</p>
                          </div>
                          <p className='text-[#333333] lato text-[15px] font-semibold'>
                              VND {totalPrice.toLocaleString()}
                          </p>
                      </section> 
                  )}
                </div>
                  
                {!booking && (
                  <Button 
                      onClick={handleBooking} 
                      disabled={selectedHotelRoomTypes.length === 0 || totalPrice <= 0}
                      className={cn(
                          "w-full mt-1 text-[20px] py-5 rounded-sm", 
                          (selectedHotelRoomTypes.length === 0 || totalPrice <= 0) 
                              ? "cursor-no-drop hover:bg-[#6792a3] bg-[#6b94a4]" 
                              : "bg-[#077dab] hover:bg-[#065f8c] text-white"
                      )}
                  >
                      Book
                  </Button>
                )}
              </section>
            )}
        </div>
    );
}

export default BillSearchingSection;