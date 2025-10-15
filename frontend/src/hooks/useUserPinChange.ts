import { useSnackbar } from "@/contexts/SnackbarContext";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { pinData } from "@/components/settings/settings";
export const useUserPinChange = () => {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (data: pinData) => {
      const res = await apiFetch("/users/me/change_pin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to update pin");
      }

      return res.json();
    },

    onSuccess: (data) => {
      showSnackbar(
        data.message || "Your pin has been changed successfully!",
        "success"
      );
    },

    onError: (error: any) => {
      showSnackbar(error.message || "Failed to change pin", "error");
    },
  });
};
