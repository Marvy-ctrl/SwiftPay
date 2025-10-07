"use client";

import { createContext, useContext, useState } from "react";
import { refreshAccessToken } from "@/lib/api";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  logout: async () => {},
});
const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
