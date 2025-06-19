import { SelectedRoomInstance } from "@/store/slices/selectedHotelRoomTypesSlice";
import { BookingGuest, BookingRoomItem } from "@prisma/client";

interface AuthCredentials {
    name: string;
    email: string;
    password: string;
    phone: string;
}

interface SignInWithOAuthParams {
    provider: "google";
    providerAccountId: string;
    user: {
      email: string;
      name: string;
      image: string;
    };
}

interface BookingDetails {
  bookingGuest: {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber?: string,
    personalRequest?: string,
    planedArrivalTime: string,
  },
  bookingData: {
    userId: string,
    fromDate: string,
    toDate: string,
  },
  usingServiceItems: {
    serviceId: string,
    quantity: number,
  }[],
  bookingRoomItems: ClientApiBookingRoomItem[]
}

interface ClientApiBookingRoomItem {
  hotelBranchRoomTypeId: string;
  quantityBooked: number;
}