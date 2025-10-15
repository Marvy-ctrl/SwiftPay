import { useMutation } from "@tanstack/react-query";
import { forgotData } from "@/components/passwords/forgot-password";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export const usePasswordRequest = () => {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: forgotData) => {
      const res = await apiFetch("/auth/request_password_reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Something went wrong");
      }

      return res.json();
    },

    onSuccess: (data) => {
      showSnackbar(data.message || "Password reset link sent!", "success");
      //   router.push("/check-email");
    },

    onError: (error: any) => {
      showSnackbar(
        error.message || "Failed to send password reset link",
        "error"
      );
    },
  });
};
