"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface VerifyResponse {
  message: string;
  Account_num?: string;
}

export const useVerifyAccount = (token: string) => {
  return useQuery<VerifyResponse, Error>({
    queryKey: ["verifyAccount", token],
    queryFn: async () => {
      const res = await apiFetch(`/auth/verify_account?token=${token}`, {
        method: "GET",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch transaction");
      }

      return res.json();
    },
    enabled: !!token,
  });
};
