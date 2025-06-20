"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return( 
    <Provider store={store}>
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
    </Provider>
  );
}