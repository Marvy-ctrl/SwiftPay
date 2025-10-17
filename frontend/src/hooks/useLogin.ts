import { useMutation } from "@tanstack/react-query";
import { apiFetch, setAccesToken } from "@/lib/api";
import { LoginData } from "@/components/auth/login-form";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Invalid credentials");
      }

      return res.json();
    },

    onSuccess: (data) => {
      setAccesToken(data.access_token);
      showSnackbar(data.message || "Login successful", "success");
      router.push("/dashboard");
    },

    onError: (error: any) => {
      showSnackbar(error.message || "Failed to log in", "error");
    },
  });
};
