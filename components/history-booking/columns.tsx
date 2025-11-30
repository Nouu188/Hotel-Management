"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { MoreHorizontal, ArrowUpDown, Copy, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookingStatus } from "@prisma/client"
import { useState } from "react"
import { toast } from "sonner"

export type Booking = {
  id: string
  roomNumber: string
  roomName: string
  bedType: string
  floor: string
  facilities: string
  bookDate: string
  bookTime: string
  imageUrl: string

  fromDate: string; 
  toDate: string;  
  status: BookingStatus;
  capacity: number;
  images: string[]; 
}

export const columns: ColumnDef<Booking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="data-[state=checked]:bg-[#066A92] data-[state=checked]:border-[#066A92] data-[state=checked]:text-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="data-[state=checked]:bg-[#066A92] data-[state=checked]:border-[#066A92] data-[state=checked]:text-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "roomName",
    header: "Room Name",
    cell: ({ row }) => {
      const booking = row.original;
      return (
        <div className="flex items-center gap-4">
          <div className="relative lg:w-50 lg:h-34 xl:w-64 xl:h-40 rounded-md overflow-hidden">
            <Image
              src="/room/deluxe-room/Deluxe_2-2000.jpg"
              alt={booking.roomName}
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div>
            <p className="text-[#077dab] font-semibold">{booking.roomNumber}</p>
            <p className="text-gray-800 font-bold">{booking.roomName}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "bedType",
    header: ({ column }) => {
      return (
        <div
          className="flex cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bed Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "floor",
    header: "Room Floor",
  },
  {
    accessorKey: "status",
    header: "Room Status",
    cell: ({ row }) => {
        return <Badge variant={row.original.status === 'COMPLETED' ? 'default' : 'secondary'}>{row.original.status}</Badge>
    }
  },
  {
    accessorKey: "bookDate",
    header: ({ column }) => {
      return (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex cursor-pointer"
        >
          Book Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => {
      const booking = row.original
      return (
        <div>
          <p className="font-bold text-gray-800">{booking.bookDate}</p>
          <p className="text-gray-500">{booking.bookTime}</p>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const handleCopyId = () => {
        navigator.clipboard.writeText(booking.id);
        toast.success("Booking ID copied to clipboard!");
      };

      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu modal={false}> 
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault();
                setIsDialogOpen(true);
              }}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View details</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={handleCopyId}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Booking ID</span>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

          <BookingDetailsDialogContent booking={booking} />
        </Dialog>
      );
    },
  },
];

import { DialogContent, DialogHeader, DialogTitle, DialogDescription, Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { roomTypeInBrief } from "@/constants/roomTypeInBrief"

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 last:border-b-0">
    <dt className="text-sm font-medium text-slate-500">{label}</dt>
    <dd className="col-span-2 text-sm text-slate-900 font-semibold">{value}</dd>
  </div>
);

const BookingDetailsDialogContent = ({ booking }: { booking: Booking }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const toggleExpand = (id: string) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

  return (
    <DialogContent className="sm:max-w-2xl mt-12">
      <DialogHeader>
        <DialogTitle className="text-xl">Booking Details</DialogTitle>
        <DialogDescription>
          Detailed information for booking ID: #{booking.id.slice(-8).toUpperCase()}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div className="relative w-full h-65 rounded-lg overflow-hidden bg-slate-100">
          <Image
            src={booking.images?.[0] || roomTypeInBrief?.[0]?.imgUrl?.[0] as string} 
            alt={booking.roomName}
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        <dl className="-my-3 divide-y divide-slate-100">
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
            <DetailRow label="Facilities" value={
              <p className="whitespace-normal">
                  {booking.facilities.length > 150 ? (
                    <>
                        {expanded[booking.id]
                            ? booking.facilities
                            : booking.facilities.slice(0, 220) + '...'}
                        <br/>
                        <button
                            onClick={() => toggleExpand(booking.id)}
                            className="text-[#56595E] underline text-sm"
                        >
                            {expanded[booking.id] ? 'Less Info' : 'More Info'}
                        </button>
                    </>
                ) : (
                    booking.facilities
                )}
              </p>
            } />
            <DetailRow label="Booked On" value={`${booking.bookDate} at ${booking.bookTime}`} />
        </dl>
      </div>
    </DialogContent>
  );
}