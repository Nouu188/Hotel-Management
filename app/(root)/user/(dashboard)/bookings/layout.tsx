"use client";

import BookingTabs from "@/components/booking-history/booking-tabs/BookingTabs";

export default function LayoutBookingTabs({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <div>
      <div className="bg-white flex justify-between border rounded-sm p-1">
        <BookingTabs />
      </div>
      <div>
        {children}
      </div>
    </div>
    );
}