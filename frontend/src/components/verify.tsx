"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyAccount } from "@/hooks/useVerify";
import { useEffect } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const { data, isLoading, error, refetch } = useVerifyAccount(token);

  useEffect(() => {
    if (data?.message === "Account verified successfully") {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [data, router]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-black">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Error: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-cyan-900 text-white rounded-md"
        >
          Retry Verification
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col justify-between text-center text-black bg-gray-50 w-[500px] h-[300px] shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mt-6">
          Welcome to <span className="text-cyan-950">SWIFTPAY</span>
        </h1>

        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-xl font-semibold">{data?.message}</h1>
          {data?.Account_num && (
            <p className="mt-4 text-black">
              Your Account Number:{" "}
              <span className="font-medium">{data.Account_num}</span>
            </p>
          )}
        </div>
        <div>
          <p className="mb-6"> Copy your account number for login</p>
        </div>
        <div className="text-sm text-gray-500">
          Thank you for verifying your account.
        </div>
      </div>
    </div>
  );
}
