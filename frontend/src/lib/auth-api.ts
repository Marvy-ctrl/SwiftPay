import { useMutation } from "@tanstack/react-query";
import React from 'react'


const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`
    : "http://localhost:3000/api/v1";



export default function AuthApi() {
  const refreshToken = async () => {
    const res = await fetch(`${BASE_URL}/auth/refresh_token`, {
      method: "POST",
      credentials: "include",
    });
    

    if (!res.ok) {
      throw new Error("Token refresh failed");
    }

    return res.json();
  };

  return { refreshToken };
}

