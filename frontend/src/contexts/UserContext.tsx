"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) throw new Error("useUser must be within a UserProvider");
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const value = { user, accessToken, setUser, setAccessToken };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
