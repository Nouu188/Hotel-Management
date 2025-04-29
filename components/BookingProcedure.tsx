import React, { useState } from 'react'
import ClientDetails, { ClientDetailsFormValues } from './bookingprocedure/ClientDetails'
import BookingCompletion from './BookingCompletion'
import { RoomInDetails } from './RoomSearchingSection'
import { api } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookingDetails } from '@/types/action'
import ROUTES from '@/constants/route'
import { toast } from '@/hooks/use-toast'

interface BookingProcedureProps {
  selectedRooms: RoomInDetails[],
}

const BookingProcedure = ({ selectedRooms }: BookingProcedureProps) => {
    const router = useRouter();
    const [completedDetails, setCompletedDetails] = useState<boolean>(false);
    const [values, setValues] = useState<ClientDetailsFormValues>();

    const searchParams = useSearchParams();
    const fromDate = searchParams.get("fromDate") as string;
    const toDate = searchParams.get("toDate") as string;

    const handleContinueClientDetails = (values: ClientDetailsFormValues) => {
      setCompletedDetails(true);
      setValues(values);
    }

    const handleSubmit = async () => {
      const bookingDetails: BookingDetails = {
        bookingGuest: {
          firstName: values?.firstName as string,
          lastName: values?.lastName as string,
          email: values?.email as string,
          personalRequest: values?.personalRequest as string,
          planedArrivalTime: values?.arrivalTime as string,
        },
        bookingData: {
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
        },
        roomItems: selectedRooms
      }

      try {
        const res = await api.booking.create(bookingDetails);
        console.log(res)
        if(res.success && res.data) {
          toast({
            title: "Booking Success",
            description: "Welcome to LaRoche"
          });
          
          router.push(ROUTES.HOME);
        } else {
          console.log("API calls failed or no data");
        }
      } catch (error) {
        console.log("Error create booking");
      }
    }

  return (
    <div className='space-y-5'>
        <ClientDetails onClick={handleContinueClientDetails} />
        <BookingCompletion onClick={handleSubmit} completedDetails={completedDetails}/>
    </div>
  )
}

export default BookingProcedure