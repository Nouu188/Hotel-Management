"use client";

import BillSearchingSection from "@/components/bill/BillSearchingSection";
import BookingProcedure from "@/components/bookingprocedure/BookingProcedure";
import RoomSelectedBookingSection from "./RoomSelectedBookingSection";

const BookingPage = () => {
    return (
        <div className={`flex flex-col justify-center bg-[#eff8fc] bg-no-repeat`}>
            <section className="flex justify-center w-full">
                <div className="flex justify-between gap-4 max-w-291">
                    <div className="flex flex-col space-y-6 my-[18px]">
                        <RoomSelectedBookingSection />
                        <BookingProcedure />
                    </div>
                    <div>
                        <BillSearchingSection booking/>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BookingPage;