import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await apiFetch("/transactions/me", {
        method: "GET",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch transactions");
      }

      return res.json();
    },
  });
};
