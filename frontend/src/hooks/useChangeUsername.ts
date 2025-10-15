import { useSnackbar } from "@/contexts/SnackbarContext";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { usernameData } from "@/components/settings/settings";

export const useChangeUsername = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (data: usernameData) => {
      const res = await apiFetch("/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to update user");
      }

      return res.json();
    },

    onSuccess: (data) => {
      showSnackbar(
        data.message || "Your username has been changed successfully!",
        "success"
      );
    },

    onError: (error: any) => {
      showSnackbar(error.message || "Failed to change username", "error");
    },
  });
};
