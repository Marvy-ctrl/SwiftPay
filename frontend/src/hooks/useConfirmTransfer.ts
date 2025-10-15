import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useSnackbar } from "@/contexts/SnackbarContext";

interface ConfirmData {
  transaction_uid: string;
  pin: string;
}

export const useConfirmTransfer = () => {
  const { showSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: async (data: ConfirmData) => {
      const response = await apiFetch("/transactions/transfer/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Invalid PIN or transaction ID");
      }

      return response.json();
    },
    onSuccess: (data) => {
      showSnackbar(
        data.status === "success"
          ? "Transfer confirmed successfully"
          : "Something went wrong",
        "success",
        4000
      );
    },

    onError: (error: any) => {
      showSnackbar(error.message || "Transfer failed", "error");
    },
  });
};
