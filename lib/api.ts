import ROUTES from "@/constants/route";
import { fetchHandler } from "./handlers/fetch";
import { Account, BookingRoomItem, RoomType, User } from "@prisma/client";
import { BookingDetails, SignInWithOAuthParams } from "@/types/action";
import { DateRange } from "react-day-picker";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hotel-management-production-c212.up.railway.app/api";

export const api = {
    auth: {
        oAuthSignIn: ({
            user,
            provider,
            providerAccountId
        }: SignInWithOAuthParams) => 
            fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
                method: "POST",
                body: JSON.stringify({ user, provider, providerAccountId })
            }),
    },
    users: {
        getAll: () => fetchHandler(`${API_BASE_URL}/users`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
        getByEmail: (email: string) =>
            fetchHandler(`${API_BASE_URL}/users/email`, {
              method: "POST",
              body: JSON.stringify({ email }),
            }),
        create: (userData: Partial<User>) => 
            fetchHandler(`${API_BASE_URL}/users`, {
                method: "POST",
                body: JSON.stringify(userData)
            }),
        update: (id: string, userData: Partial<User>) => 
            fetchHandler(`${API_BASE_URL}/users/${id}`, {
                method: "POST",
                body: JSON.stringify(userData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/users/${id}`, {
                method: "DELETE"
            })
    },
    accounts: {
        getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
        getByProvider: (providerAccountId: string) => fetchHandler(`${API_BASE_URL}/accounts/provider`, {
            method: "POST",
            body: JSON.stringify({ providerAccountId })
        }),
        create: (accountData: Partial<Account>) => 
            fetchHandler(`${API_BASE_URL}/accounts`, {
                method: "POST",
                body: JSON.stringify(accountData)
            }),
        update: (id: string, accountData: Partial<Account>) => 
            fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
                method: "POST",
                body: JSON.stringify(accountData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
                method: "DELETE"
            })
    },
    roomsType: {
        getAll: () => fetchHandler(`${API_BASE_URL}/roomsType`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/roomsType/${id}`),
        getByFilter: (branchName: string, guestAllocations: { adults: number; children: number; infants: number }[], dateRange: DateRange | undefined) => 
            fetchHandler(`${API_BASE_URL}/roomsType/filter`, {
                method: "POST",
                body: JSON.stringify({ branchName, guestAllocations, dateRange })
            }),
        create: (roomData: Partial<RoomType>) => 
            fetchHandler(`${API_BASE_URL}/roomsType`, {
                method: "POST",
                body: JSON.stringify(roomData)
            }),
        update: (id: string, roomData: Partial<RoomType>) => 
            fetchHandler(`${API_BASE_URL}/roomsType/${id}`, {
                method: "POST",
                body: JSON.stringify(roomData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/roomsType/${id}`, {
                method: "DELETE"
            })
    },
    booking: {
        getAll: () => fetchHandler(`${API_BASE_URL}/booking`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/booking/${id}`),
        create: (bookingData: Partial<BookingDetails>) => 
            fetchHandler(`${API_BASE_URL}/booking`, {
                method: "POST",
                body: JSON.stringify(bookingData)
            }),
        update: (id: string, bookingData: Partial<BookingRoomItem>) => 
            fetchHandler(`${API_BASE_URL}/booking/${id}`, {
                method: "POST",
                body: JSON.stringify(bookingData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/booking/${id}`, {
                method: "DELETE"
            })
    },
    hotelBranchRoomType: {
        getQuantityById: (roomTypeId: string, hotelBranchId: string, dateRange: DateRange | undefined) => 
            fetchHandler(`${API_BASE_URL}/hotelBranchRoomType/quantity`, {
                method: "POST",
                body: JSON.stringify({ roomTypeId, hotelBranchId, dateRange })
            }),
    }
}