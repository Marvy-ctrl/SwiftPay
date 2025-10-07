"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AppProvider({ children }: { children: ReactNode }) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
