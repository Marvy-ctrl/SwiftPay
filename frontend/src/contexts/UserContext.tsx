// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";
// import { apiClient, setAuthContext } from "@/lib/api-client";
// import { useEffect } from "react";

// type User = {
//   accountNumber: string;
//   balance: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   uid: string;
//   username: string;
// };
// type UserContextType = {
//   user: User | null;
//   accessToken: string | null;
//   setUser: (user: User | null) => void;
//   setAccessToken: (token: string | null) => void;
// };

// const UserContext = createContext<UserContextType | undefined>(undefined);
// const BASE_URL =
//   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1` || "http://localhost:3000";

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);

//   const getAccessToken = () => accessToken;

//   const refreshToken = async (): Promise<string> => {
//     const res = await fetch(`${BASE_URL}/auth/refresh_token`, {
//       method: "POST",
//       credentials: "include",
//     });
//     if (!res.ok) throw new Error("Failed to refresh token");

//     const { ["New Access Token"]: newToken } = await res.json();
//     setAccessToken(newToken);
//     return newToken;
//   };

//   const clearUser = () => {
//     setUser(null);
//     setAccessToken(null);
//   };

//   useEffect(() => {
//     setAuthContext({ getAccessToken, refreshToken, clearUser });
//   }, [accessToken]);

//   const value = { user, accessToken, setUser, setAccessToken };

//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// };

// export const useUser = () => {
//   const context = useContext(UserContext);

//   if (!context) throw new Error("useUser must be within a UserProvider");
//   return context;
// };

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { setAuthContext } from "../../lib/api-client";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
  : "http://localhost:3000/api/v1";

type User = {
  accountNumber: string;
  balance: number;
  email: string;
  firstName: string;
  lastName: string;
  uid: string;
  username: string;
};

type UserContextType = {
  user: User | null;
  accessToken: string | null;
  setUser: (u: User | null) => void;
  setAccessToken: (t: string | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  async function refreshToken() {
    const res = await fetch(`${BASE_URL}/auth/refresh_token`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to refresh");
    const data = await res.json();
    const newToken = data.accessToken || data.token;
    setAccessToken(newToken);
    return newToken;
  }

  function clearUser() {
    setUser(null);
    setAccessToken(null);
  }

  useEffect(() => {
    setAuthContext({
      getAccessToken: () => accessToken,
      refreshToken,
      clearUser,
    });
  }, [accessToken]);

  return (
    <UserContext.Provider
      value={{ user, accessToken, setUser, setAccessToken }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
