import { RoomInDetails } from "@/components/RoomSearchingSection";

interface AuthCredentials {
    name: string;
    email: string;
    password: string;
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
    personalRequest?: string,
    planedArrivalTime: string,
  },
  bookingData: {
    fromDate: Date,
    toDate: Date,
  },
  roomItems: RoomInDetails[]
}