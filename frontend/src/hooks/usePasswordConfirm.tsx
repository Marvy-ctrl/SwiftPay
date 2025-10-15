import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useRouter } from "next/navigation";
import { resetData } from "@/components/passwords/passwordreset-form";
import { apiFetch } from "@/lib/api";

export const usePasswordConfirm = () => {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: resetData & { token: string }) => {
      const res = await apiFetch(`/auth/password_reset_confirm/${data.token}`, {
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
      showSnackbar(
        data.message || "Your Password has been reset successfully!",
        "success"
      );
      router.push("/login");
    },

    onError: (error: any) => {
      showSnackbar(error.message || "Failed to reset password", "error");
    },
  });
};
