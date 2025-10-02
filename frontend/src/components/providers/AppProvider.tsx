"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { UserProvider } from "@/contexts/UserContext";

export default function AppProvider({ children }: { children: ReactNode }) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <UserProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
