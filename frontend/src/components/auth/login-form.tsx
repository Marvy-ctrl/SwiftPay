"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useLogin } from "@/hooks/useLogin";

const loginSchema = z.object({
  account_number: z
    .string()
    .max(10)
    .min(10, { message: "Account number must be exactly 10 digits" }),
  password: z.string().min(8, {
    message:
      "Password must have at least 8 characters including uppercase, lowercase, digit, and special character",
  }),
});

type FormData = z.infer<typeof loginSchema>;

export interface LoginData {
  account_number: string;
  password: string;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((data) => login(data));

  return (
    <form onSubmit={onSubmit}>
      <div className="flex min-h-screen">
        <div className="w-full md:w-1/2 bg-white text-black flex flex-col justify-center px-8">
          <div className="mb-6 flex justify-center">
            <Image
              src="/swift-logo.png"
              alt="Swiftpay"
              width={100}
              height={100}
            />
          </div>

          <h1 className="font-bold text-3xl text-center">Welcome Back</h1>
          <p className="text-gray-500 text-[14px] mb-8 text-center">
            Don’t have an account yet?{" "}
            <Link href="/signup" className="text-cyan-900 underline">
              Sign up
            </Link>
          </p>

          <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
            <div className="flex flex-col items-start">
              <label className="font-medium mb-1">Account Number</label>
              <input
                type="text"
                {...register("account_number")}
                placeholder="Enter your 10-digit account number"
                className="w-full border border-cyan-900 rounded-md px-3 py-2"
              />
              {errors.account_number && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.account_number.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start relative">
              <label className="text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className="w-full border border-cyan-900 rounded-md px-3 py-2"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
              <button
                type="button"
                className="absolute top-9 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-cyan-950 text-white py-2 rounded-md cursor-pointer ${
                isPending ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "Logging in..." : "Login"}
            </button>

            <div className="mt-2 text-center">
              <Link
                href="/forgot-password"
                className="text-cyan-900 text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div className="mt-8 text-gray-400 text-xs text-center">
            ©2025 Swiftpay
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 bg-[url('/atm-image.jpg')] bg-cover bg-center"></div>
      </div>
    </form>
  );
}
