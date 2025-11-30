"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Booking } from "./columns"; // Import lại kiểu Booking của bạn
import Image from "next/image";
import dayjs from "dayjs";

// Định nghĩa props cho component
interface BookingDetailsDialogProps {
  booking: Booking;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="col-span-2 text-sm text-gray-900 font-semibold">{value}</dd>
  </div>
);

export const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({ booking, isOpen, onOpenChange }) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Booking Details</DialogTitle>
          <DialogDescription>
            Detailed information for booking ID: {booking.roomNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Ảnh phòng */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={booking.images[0] || "/placeholder-room.jpg"} // Lấy ảnh đầu tiên
              alt={booking.roomName}
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Chi tiết đặt phòng */}
          <dl>
            <DetailRow label="Room Name" value={booking.roomName} />
            <DetailRow 
              label="Status" 
              value={<Badge variant={booking.status === 'COMPLETED' ? 'default' : 'secondary'}>{booking.status}</Badge>} 
            />
            <DetailRow 
              label="Booking Period" 
              value={`${dayjs(booking.fromDate).format('MMM D, YYYY')} - ${dayjs(booking.toDate).format('MMM D, YYYY')}`} 
            />
            <DetailRow label="Bed Type" value={booking.bedType} />
            <DetailRow label="Capacity" value={`${booking.capacity} person(s)`} />
            <DetailRow label="Facilities" value={<p className="whitespace-normal">{booking.facilities}</p>} />
            <DetailRow label="Booked On" value={`${booking.bookDate} at ${booking.bookTime}`} />
          </dl>
        </div>
      </DialogContent>
    </Dialog>
  );
};