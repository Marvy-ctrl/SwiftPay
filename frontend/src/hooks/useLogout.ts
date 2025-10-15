import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const useLogout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {},
  });
};
