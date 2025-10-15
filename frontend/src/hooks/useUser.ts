import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const useUser = () => {
  // const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await apiFetch("/users/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    // enabled: !!accessToken,
  });
};
