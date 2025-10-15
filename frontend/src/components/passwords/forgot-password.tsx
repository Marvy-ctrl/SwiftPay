"use client";
import { usePasswordRequest } from "@/hooks/usePasswordRequest";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const forgotSchema = z.object({
  email: z.email().min(5, { message: "Field is required" }),
});
type FormData = z.infer<typeof forgotSchema>;

export interface forgotData {
  email: string;
}
export default function ForgotPassword() {
  const { mutate: forgot, isPending } = usePasswordRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(forgotSchema) });
  const onSubmit = handleSubmit((data) => {
    forgot(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-gray-50 shadow-md rounded-xl p-8 w-[400px] text-center">
        <h1 className="text-2xl font-bold mb-2 text-cyan-900">
          Forgot your Password
        </h1>
        <p className="text-gray-700 mb-6 text-sm">
          Please enter the email address you created your account with and a
          verification link will be sent there.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="text-left text-sm font-medium">
            Enter your email
          </label>

          <input
            type="text"
            {...register("email")}
            placeholder="Your email address"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-900"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`${
              isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-cyan-800"
            } bg-cyan-900 text-white py-2 rounded-md font-semibold transition`}
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
