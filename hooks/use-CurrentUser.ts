import { useSession } from 'next-auth/react'

export function useCurrentUser() {
    const { data: session, status, update } = useSession();

    const isLoading = status === "loading";

    return {
        user: session?.user,
        update,
        isLoading,
        isAuthenticated: !!session?.user,
    };
}