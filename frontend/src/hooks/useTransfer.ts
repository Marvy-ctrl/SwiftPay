import React from "react";
import { transferData } from "@/components/send-money/send-money";
import { useMutation } from "@tanstack/react-query";
import { apiFetch, setAccesToken as setApiAccessToken } from "@/lib/api";

export const useTransfer = () => {
  return useMutation({
    mutationFn: async (data: transferData) => {
      const response = await apiFetch("/transactions/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "invalid account number");
      }
      return response.json();
    },
  });
};
