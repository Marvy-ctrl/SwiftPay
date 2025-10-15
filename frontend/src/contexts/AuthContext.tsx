"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type AuthContextType = {
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  logout: async () => {},
});

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const logout = async () => {
    await apiFetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
