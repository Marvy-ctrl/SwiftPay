"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type SnackbarVariant = "success" | "error" | "warning" | "info";
type SnackbarState = {
  message: string;
  variant: SnackbarVariant;
} | null;
type SnackbarContextType = {
  showSnackbar: (
    message: string,
    variant?: SnackbarVariant,
    duration?: number
  ) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }

  return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const showSnackbar = useCallback(
    (
      msg: string,
      variant: SnackbarVariant = "info",
      duration: number = 3000
    ) => {
      setSnackbar({ message: msg, variant });
      setTimeout(() => setSnackbar(null), duration);
    },
    []
  );

  const variantStyles: Record<SnackbarVariant, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-600 text-black",
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {snackbar && (
        <div
          className={`fixed w-[70%] max-w-[300px] text-center bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-sm text-white ${
            variantStyles[snackbar.variant]
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </SnackbarContext.Provider>
  );
};
