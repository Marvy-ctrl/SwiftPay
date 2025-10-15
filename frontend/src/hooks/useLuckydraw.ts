import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export const useLuckydraw = () => {
  const statsQuery = useQuery({
    queryKey: ["lucky-draw-stats"],
    queryFn: async () => {
      const res = await apiFetch("/luckydraw/stats");
      if (!res.ok) throw new Error("Failed to fetch lucky draw stats");
      return res.json();
    },
  });

  const playDrawMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch("/luckydraw/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to play draw");
      }

      return res.json();
    },
  });

  return { statsQuery, playDrawMutation };
};
