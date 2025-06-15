import { HotelBranch, HotelBranchRoomType, RoomType } from "@prisma/client";

export type HotelBranchRoomTypeItem = HotelBranchRoomType & {
  roomType: RoomType,
  hotelBranch: HotelBranch
}

export type HotelBranchRoomTypeItemWithStatus = HotelBranchRoomTypeItem & {
  remainingQuantity: number,
  availabilityStatus: 'available' | 'sold_out' | "limited"
}

export interface GuestAllocation {
  adults: number;
  children: number;
  infants: number;
}

export interface BookingItem {
  roomData: RoomInDetails;
  guestAllocation: {
    adults: number;
    children: number;
    infants: number;
  };
}