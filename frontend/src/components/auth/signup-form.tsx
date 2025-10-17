"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useSignup } from "@/hooks/useSignup";

const signupSchema = z
  .object({
    first_name: z.string().min(3, { message: "Field is required" }),
    last_name: z.string().min(3, { message: "Field is required" }),
    username: z.string().min(3, { message: "Field is required" }),
    email: z.email().min(5, { message: "Field is required" }),
    password: z.string().min(8, {
      message:
        "Password must have atleast 8 characters with one uppercase, one lowercase one digit and one special character",
    }),
    confirm_password: z.string(),
    transaction_pin: z.string().min(4, {
      message: "Pin must be 4 digits",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof signupSchema>;

export interface SignUpdata {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  transaction_pin: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const { mutate: signup, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(signupSchema) });
  const onSubmit = handleSubmit((data) =>
    signup(data, { onSuccess: () => reset() })
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="flex min-h-screen">
        <div className="w-full md:w-1/2 bg-white text-black flex flex-col justify-center px-8">
          <div className="m-6 flex justify-center">
            <Image
              src="/swift-logo.png"
              alt="Swiftpay"
              width={100}
              height={100}
            />
          </div>

          <h1 className="font-bold text-3xl text-center">Welcome Back</h1>
          <p className="text-gray-500 text-[14px] mb-8 text-center">
            Don't have an account yet?{" "}
            <Link href="/login" className="text-cyan-900 underline">
              Sign in
            </Link>
          </p>

          <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
            <div className="flex flex-col items-start">
              <label className=" font-medium mb-1">First Name</label>
              <input
                type="text"
                {...register("first_name")}
                placeholder="Enter your first name"
                className="w-full border border-cyan-900 rounded-md px-3 py-2"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start">
              <label className=" font-medium mb-1">Last Name</label>
              <input
                type="text"
                {...register("last_name")}
                placeholder="Enter your last name"
                className="w-full border border-cyan-900 rounded-md px-3 py-2"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start">
              <label className=" font-medium mb-1">Email Address</label>
              <input
                type="text"
                {...register("email")}
                placeholder="Enter your email address"
                className="w-full border border-cyan-900 rounded-md px-3 py-2"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start">
              <label className=" font-medium mb-1">Username</label>
              <input
                type="text"
                {...register("username")}
                placeholder="Enter your username"
                className="w-full border border-cyan-900 rounded-md px-3 py-2"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start relative">
              <label className="text-sm font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className="w-full border border-cyan-900 rounded-md px-3 py-2 "
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
              <button
                type="button"
                className="absolute top-9 right-3.5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="flex flex-col items-start relative">
              <label className="text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirm_password")}
                placeholder="Confirm password"
                className="w-full border border-cyan-900 rounded-md px-3 py-2 "
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm_password.message}
                </p>
              )}
              <button
                type="button"
                className="absolute top-9 right-3.5"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="flex flex-col items-start relative">
              <label className="text-sm font-medium mb-1">Pin</label>
              <input
                type={showPin ? "text" : "password"}
                {...register("transaction_pin")}
                placeholder="Enter your pin"
                className="w-full border border-cyan-900 rounded-md px-3 py-2 "
              />
              {errors.transaction_pin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.transaction_pin.message}
                </p>
              )}
              <button
                type="button"
                className="absolute right-3.5 top-9"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-950 text-white py-2 rounded-md "
              disabled={isPending}
            >
              {isPending ? "Creating your account..." : "Signup"}
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
