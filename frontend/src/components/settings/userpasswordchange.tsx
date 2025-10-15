"use client";
import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserChangePassword } from "@/hooks/useUserChangePassword";

const passwordSchema = z.object({
  old_password: z.string().min(8, {
    message:
      "Password must have atleast 8 characters with one uppercase, one lowercase one digit and one special character",
  }),
  new_password: z.string().min(8, {
    message:
      "Password must have atleast 8 characters with one uppercase, one lowercase one digit and one special character",
  }),
});

type FormData = z.infer<typeof passwordSchema>;

export default function UserPasswordChange() {
  const { mutate, isPending } = useUserChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(passwordSchema) });
  const onSubmit = handleSubmit((data) => mutate(data));
  return (
    <div className="w-full max-w-[600px]  p-6 space-y-6">
      <h1 className="text-2xl font-bold">Login Settings</h1>
      <div>
        <form onSubmit={onSubmit}>
          <label className="block font-semibold text[18px] mb-3">
            Enter your old Password:
          </label>
          <input
            type="text"
            {...register("old_password")}
            placeholder="Enter your old password"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          {errors.old_password && (
            <p className="text-red-500 text-sm mt-2">
              {errors.old_password.message}
            </p>
          )}
          <label className="block font-semibold text[18px] mt-3 mb-3">
            Enter your new Password:
          </label>
          <input
            type="text"
            {...register("new_password")}
            placeholder="Enter your new password"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          {errors.new_password && (
            <p className="text-red-500 text-sm mt-2">
              {errors.new_password.message}
            </p>
          )}
          <div className=" mt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-[200px] bg-cyan-900 hover:bg-cyan-800 text-white text-[18px] font-medium rounded-md px-4 py-2"
            >
              {isPending ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
