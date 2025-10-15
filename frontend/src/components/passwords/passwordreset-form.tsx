import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePasswordConfirm } from "@/hooks/usePasswordConfirm";
import { useSearchParams } from "next/navigation";

export interface resetData {
  reset_password: string;
}
const passwordSchema = z.object({
  password: z.string().min(8, {
    message:
      "Password must have at least 8 characters including uppercase, lowercase, digit, and special character",
  }),
});
type FormData = z.infer<typeof passwordSchema>;

export default function PasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: reset, isPending } = usePasswordConfirm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = handleSubmit((data) => {
    if (!token) {
      alert("Invalid or missing token");
      return;
    }

    reset({ reset_password: data.password, token });
  });

  return (
    <form onSubmit={onSubmit}>
      <label className="block text-2xl font-semibold text-gray-700 mb-6">
        Enter new password
      </label>
      <input
        type="password"
        {...register("password")}
        placeholder="Enter your new password"
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
      {errors.password && (
        <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
      )}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-cyan-950 text-white py-2 rounded-md cursor-pointer ${
            isPending ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isPending ? "Resetting Password..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
}
