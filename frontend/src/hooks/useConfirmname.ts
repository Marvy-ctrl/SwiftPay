"use client";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export const useConfirmname = (account_number: string) => {
  return useQuery({
    queryKey: ["receiver_detail", account_number],
    queryFn: async () => {
      const res = await apiFetch(
        `/transactions/confirm/name?account_number=${account_number}`,
        {
          method: "POST",
        }
      );

      return await res.json();
    },
    enabled: !!account_number,
  });
};
