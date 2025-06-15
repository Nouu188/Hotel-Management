import React from 'react'
import { Button } from './ui/button'
import { CalendarSearch, Gift } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import FloatingChatButton from './FloatingChatButton'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { addDays } from 'date-fns'

const QuickActionBar = () => {
  const router = useRouter();

  const selectedBranch = useSelector((state: RootState) => state.filterHotelRoomType.selectedBranch);
  const dateRange = useSelector((state: RootState) => state.filterHotelRoomType.dateRange);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fromDate = dateRange?.from?.toISOString().split("T")[0];
    let toDate: string | undefined;

    if (dateRange?.to) {
      const tmpDate = addDays(new Date(), 1); 
      if (tmpDate.getDay() === dateRange.to.getDay()) {
          toDate = dateRange?.to?.toISOString().split("T")[0];
      } else {
          const originalToDate = dateRange.to;
          const oneDayMillis = 24 * 60 * 60 * 1000;
          const nextDayTimeMillis = originalToDate.getTime() + oneDayMillis;
          const modifiedToDate = new Date(nextDayTimeMillis);
          toDate = modifiedToDate.toISOString().split("T")[0];
      }
    } else {
      toDate = fromDate; 
    }

    if (fromDate && !toDate) {
      toDate = fromDate;
    }

    router.push(
      `/book-directonline?branch=${encodeURIComponent(selectedBranch)}&fromDate=${fromDate}&toDate=${toDate}`
    );
  };

  return (
    <div className='flex justify-between items-center px-4 lg:hidden z-100 fixed w-full'>
      <Button onClick={handleSubmit} className='border-[#C19C51] text-[#C19C51] text-md bg-[#081746] hover:bg-[#081746] cursor-pointer max-w-84 max-md:max-w-64 max-sm:max-w-48 py-6 container raleway border-1 rounded-4xl'>
        <CalendarSearch className='scale-200'/>
        Book now
      </Button>

      <div className='flex gap-4'>
        <Popover>
          <PopoverTrigger>
            <div className='bg-[#081746] hover:bg-[#081746] border-[#C19C51] cursor-pointer min-w-12.5 border-1 p-5 rounded-full'>
              <Gift className='text-[#C19C51] scale-180'/>
            </div>
          </PopoverTrigger>
          <PopoverContent className='bg-[#081746] border-none text-center rounded-none'>
            <p className='playfair text-[#bf882e]'>BEST PRICE GUARANTEE</p>
            <div className='raleway text-white'>
              Enter the special code SUPERSAVE to get further 10% DISCOUNT on all current rate plans
            </div>
            <Button className='bg-[#bf882e] hover:bg-amber-700 rounded-none w-full mt-2'>
              Book with code
            </Button>
          </PopoverContent>
        </Popover>  

        <FloatingChatButton/>  
      </div>
    </div>
  )
}

export default QuickActionBar