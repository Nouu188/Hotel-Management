"use client";

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, FileText } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AppDispatch, RootState } from '@/store/store';
import { fetchHistoryBookings } from '@/store/slices/historyBookingSlice';
import BookingTableSkeleton from './BookingTableSkeleton';


const HistoryBooking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(true);

  const { bookings, status, error } = useSelector((state: RootState) => state.history);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHistoryBookings());
    }
  }, [status, dispatch]);

  let content;

  if (status === 'loading') {
    content = <BookingTableSkeleton />
  } else if (status === 'succeeded') {
    content = <DataTable columns={columns} data={bookings} />;
  } else if (status === 'failed') {
    content = <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">History Booking</h2>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#077dab] text-[#077dab] hover:text-white hover:bg-[#077dab] rounded-lg font-semibold text-sm cursor-pointer">
                <Calendar size={16} />
                Date Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-[#077dab] text-[#077dab] hover:text-white hover:bg-[#077dab] rounded-lg font-semibold text-sm cursor-pointer">
                <FileText size={16} />
                Generate Report
            </button>
        </div>
      </div>
       
      <div className="mt-6">
        {content}
      </div>
    </div>
  );
};

export default HistoryBooking;