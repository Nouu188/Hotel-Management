import ROUTES from "@/constants/route";
import { fetchHandler } from "./handlers/fetch";
import { Account, BookingRoomItem, Prisma, Room, User } from "@prisma/client";
import { BookingDetails, SignInWithOAuthParams } from "@/types/action";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

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
    rooms: {
        getAll: () => fetchHandler(`${API_BASE_URL}/rooms`),
        getById: (id: string) => fetchHandler(`${API_BASE_URL}/rooms/${id}`),
        getByFilter: (branchName: string, items: { adults: number; children: number; infants: number }[]) => 
            fetchHandler(`${API_BASE_URL}/rooms/filter`, {
                method: "POST",
                body: JSON.stringify({ branchName, items })
            }),
        create: (roomData: Partial<Room>) => 
            fetchHandler(`${API_BASE_URL}/rooms`, {
                method: "POST",
                body: JSON.stringify(roomData)
            }),
        update: (id: string, roomData: Partial<Room>) => 
            fetchHandler(`${API_BASE_URL}/rooms/${id}`, {
                method: "POST",
                body: JSON.stringify(roomData)
            }),
        delete: (id: string) => 
            fetchHandler(`${API_BASE_URL}/rooms/${id}`, {
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
    }
}