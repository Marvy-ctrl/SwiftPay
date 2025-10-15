import { useSnackbar } from "@/contexts/SnackbarContext";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { passwordData } from "@/components/settings/settings";
export const useUserChangePassword = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (data: passwordData) => {
      const res = await apiFetch("/users/me/change_password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to update password");
      }

      return res.json();
    },

    onSuccess: (data) => {
      showSnackbar(
        data.message || "Your password has been changed successfully!",
        "success"
      );
    },

    onError: (error: any) => {
      showSnackbar(error.message || "Failed to change password", "error");
    },
  });
};
