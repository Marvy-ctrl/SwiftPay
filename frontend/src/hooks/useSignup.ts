import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { SignUpdata } from "@/components/auth/signup-form";

export const useSignup = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (data: SignUpdata) => {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Error creating account");
      }

      return res.json();
    },

    onSuccess: (data) => {
      showSnackbar(
        data.message ||
          "Account created successfully, check your email for verification",
        "success"
      );
    },

    onError: (error: any) => {
      showSnackbar(error.message || "Failed to create account", "error");
    },
  });
};
