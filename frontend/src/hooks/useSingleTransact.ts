"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export const useSingleTransact = (uid: string) => {
  return useQuery({
    queryKey: ["transaction", uid],
    queryFn: async () => {
      const res = await apiFetch(`/transactions/${uid}`, {
        method: "GET",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch transaction");
      }

      return res.json();
    },
  });
};
