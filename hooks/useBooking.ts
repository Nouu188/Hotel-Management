"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { AppDispatch, RootState } from '@/store/store';
import { clearAllRoomSelections } from '@/store/slices/selectedHotelRoomTypesSlice';
import { BookingDetails, ClientApiBookingRoomItem } from '@/types/action';
import ROUTES from '@/constants/route';
import { useState } from 'react';
import { SectionName } from '@/components/bookingprocedure/BookingProcedure';
import { ClientDetailsFormValues } from './useClientDetailForm';

export const useBooking = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch: AppDispatch = useDispatch();
  const { data: session } = useSession();
  
  const selectedHotelRoomTypes = useSelector((state: RootState) => state.selectedHotelRoomTypes.selectedInstances);
  const selectedExtra = useSelector((state: RootState) => state.selectedExtras.selections)

  const [activeSection, setActiveSection] = useState<SectionName>('details');
    
  const [completedDetails, setCompletedDetails] = useState<boolean>(false);
  const [completedExtras, setCompletedExtras] = useState<boolean>(false);

  const [clientDetailsValues, setClientDetailsValues] = useState<ClientDetailsFormValues>();

  const handleCompleteClientDetails = (clientDetailsValues: ClientDetailsFormValues) => {
    setCompletedDetails(true);
    setActiveSection('extras');
    setClientDetailsValues(clientDetailsValues);
  }

  const handleCompleteExtras = () => {
    setActiveSection('completion');
    setCompletedExtras(true);
  };

  const handleToggleSection = (section: SectionName) => {
    const newActiveSection = activeSection === section ? 'none' : section;

    if (newActiveSection === 'details') {
      setCompletedDetails(false);
      setCompletedExtras(false);
    }
    if (newActiveSection === 'extras' && !completedDetails) {
        return;
    }
    if (newActiveSection === 'completion' && !completedExtras) {
        return;
    }

    setActiveSection(newActiveSection);
  }

  const handleBookingSubmit = async (clientDetailsValues: ClientDetailsFormValues) => {
    if (!session?.user?.id) {
      toast({ title: "Authentication Error", description: "You must be signed in to book." });
      return;
    }
    const fromDateStr = searchParams.get("fromDate");
    const toDateStr = searchParams.get("toDate");
    if (!fromDateStr || !toDateStr) {
      toast({ title: "Error", description: "Date range is missing." });
      return;
    }
    if (selectedHotelRoomTypes.length === 0) {
      toast({ title: "Error", description: "No rooms selected for booking." });
      return;
    }

    try {
      const aggregatedRoomItemsMap = new Map<string, ClientApiBookingRoomItem>();

      selectedHotelRoomTypes.forEach(instance => {
        const hotelBranchRoomTypeId = instance.originalRoomData.id;
        const existingItem = aggregatedRoomItemsMap.get(hotelBranchRoomTypeId);
        if (existingItem) {
          existingItem.quantityBooked += 1;
        } else {
          aggregatedRoomItemsMap.set(hotelBranchRoomTypeId, {
            hotelBranchRoomTypeId,
            quantityBooked: 1,
          });
        }
      });
      const finalBookingRoomItems = Array.from(aggregatedRoomItemsMap.values());

      const aggregatedService = selectedExtra;
      
      const finalBookingService = aggregatedService
        .filter(instance => instance.quantityFinal !== 0)
        .map(instance => ({
          serviceName: instance.name,
          quantity: instance.quantityFinal,
          totalPrice: instance.priceFinal,
        }));

      const bookingDetails: BookingDetails = {
        bookingGuest: {
          firstName: clientDetailsValues.firstName,
          lastName: clientDetailsValues.lastName,
          email: clientDetailsValues.email,
          personalRequest: clientDetailsValues.personalRequest,
          planedArrivalTime: clientDetailsValues.arrivalTime,
        },
        bookingData: {
          userId: session.user.id,
          fromDate: new Date(fromDateStr),
          toDate: new Date(toDateStr),
        },
        usingServiceItems: finalBookingService,
        bookingRoomItems: finalBookingRoomItems,
      };

      const res = await api.booking.create(bookingDetails);

      if (res.success && res.data) {
        toast({
          title: "Booking Successful!",
          description: "Your booking has been confirmed. Welcome to La Sieste.",
        });
        dispatch(clearAllRoomSelections());
        router.push(ROUTES.HOME); 
      } else {
        throw new Error("Could not complete your booking. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } 
  };

  return { 
    handleBookingSubmit,
    setCompletedDetails,
    setClientDetailsValues,
    setActiveSection,
    setCompletedExtras,
    handleCompleteClientDetails,
    handleCompleteExtras,
    handleToggleSection,
    completedExtras,
    activeSection,   
    clientDetailsValues,
    completedDetails,
  };
};