import { Button } from '@/components/ui/button';
import React from 'react'

const bookingHistoryElements = ["All", "Pending Payment", "Paid", "Check In", "Completed", "Cancelled", "Refunded"];

const BookingTabs = () => {
  return (
    <div className="bg-white flex justify-between rounded-sm p-2 w-full">
        {bookingHistoryElements.map((item, id) => (
          <Button
            variant="ghost"
            className='hover:bg-white hover:text-[#BF882E] cursor-pointer'
            key={id}
          >
            {item}
          </Button>
        ))}
    </div>
  )
}

export default BookingTabs