"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { json, string, z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@/contexts/SnackbarContext";
import { useUser } from "@/contexts/UserContext";

const loginSchema = z.object({
  account_number: z
    .string()
    .max(10)
    .min(10, { message: "Account number must be exactly 10 digits" }),

  password: z.string().min(8, {
    message:
      "Password must have atleast 6 characters with one uppercase, one lowercase one digit and one special character",
  }),
});

interface LoginData {
  account_number: string;
  password: string;
}

type FormData = z.infer<typeof loginSchema>;
const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export default function LoginForm() {
  const { showSnackbar } = useSnackbar();
  const { setUser, setAccessToken } = useUser();
  const router = useRouter();

  const login = async (data: LoginData) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      showSnackbar(error.detail || "Failed to logged in", "error");
    }

    const success = await response.json();
    const user = success.user;
    const userInfo = {
      accountNumber: user.account_number,
      balance: user.balance,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      uid: user.uuid,
      username: user.username,
    };

    showSnackbar(success.message, "success");
    setAccessToken(success.access_token);
    setUser(userInfo);
    router.push("/dashboard");

    return success;
  };

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(loginSchema) });
  const onSubmit = handleSubmit((data) => mutation.mutate(data));

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
              <label className=" font-medium mb-1">Account Number</label>
              <input
                type="number"
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

            <div className="flex flex-col items-start">
              <label className="text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full border border-cyan-900 rounded-md px-3 py-2 "
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-950 text-white py-2 rounded-md cursor-pointer"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Logging in..." : "Login"}
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
