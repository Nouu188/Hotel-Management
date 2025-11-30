"use client";

import Image from "next/image";
import { KeyRound, Users, BedDouble, CalendarDays, Info, ChevronRight, ChevronLeft } from "lucide-react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useState } from "react";
import { BookingStatus } from "@prisma/client";
import { RootState } from "@/store/store";
import { CurrentBookingSkeleton } from "./CurrentBookingSkeleton";
import { roomTypeInBrief } from "@/constants/roomTypeInBrief";

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon size={16} />
            <span>{label}</span>
        </div>
        <p className="font-bold text-gray-800 mt-1">{value}</p>
    </div>
);

const CurrentBookingCard = () => {
    const { bookings, status } = useSelector((state: RootState) => state.history);
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentBookings = bookings.filter(b =>
        b.status === BookingStatus.CHECKED_IN || b.status === BookingStatus.CONFIRMED
    );

    if (status === 'loading' || status === 'idle') {
        return <CurrentBookingSkeleton />;
    }

    if (!currentBookings.length) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800">Current Booking</h2>
                <div className="mt-6 text-center text-gray-500 py-10">
                    You have no active bookings at the moment.
                </div>
            </div>
        );
    }

    const item = currentBookings[currentIndex];
    const fromDate = dayjs(item.fromDate).format('MMM D');
    const toDate = dayjs(item.toDate).format('D, YYYY');
    const dateRange = `${fromDate} - ${toDate}`;

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % currentBookings.length);
    };

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + currentBookings.length) % currentBookings.length);
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Current Booking</h2>

            {currentBookings.length > 1 && (
                <div className="absolute top-6 right-6 flex gap-2">
                    <button onClick={goPrev} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={goNext} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            <div key={item.id}>
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-15 h-15 bg-[#077dab] text-white rounded-full">
                        <KeyRound size={30} />
                    </div>
                    <div className="max-xl:flex-grow xl:flex xl:justify-between w-full">
                        <div>
                            <p className="text-sm text-[#077dab]">Booking ID #{item.id.slice(-8).toUpperCase()}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{item.roomName}</h3>
                        </div>
                        <div className="max-xl:mt-4 xl:mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
                            <InfoItem icon={Users} label="Room Capacity" value={`${item.capacity} Person`} />
                            <div className="translate-x-4">
                                <InfoItem icon={BedDouble} label="Bed Type" value={item.bedType} />
                            </div>
                            <InfoItem icon={CalendarDays} label="Booking Date" value={dateRange} />
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">Room Facilities</h3>
                        <Info size={16} className="text-gray-400" />
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">{item.facilities}</p>
                </div>

                <div className="mt-6 relative">
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                        {roomTypeInBrief[0].imgUrl && roomTypeInBrief[0].imgUrl.map((imgUrl, index) => (
                            <div key={index} className="relative flex-shrink-0 w-[240px] h-[180px]">
                                <Image
                                    src={imgUrl}
                                    alt={`Room Image ${index + 1}`}
                                    layout="fill"
                                    className="rounded-lg object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentBookingCard;
