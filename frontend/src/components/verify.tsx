"use client";

import { useSearchParams } from "next/navigation";
import { useVerifyAccount } from "@/hooks/useVerify";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const { data, isLoading, error, refetch } = useVerifyAccount(token);

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
      <div className="text-center text-black">
        <h1 className="text-xl font-semibold">{data?.message}</h1>
        {data?.Account_num && (
          <p className="mt-2 text-gray-700">
            Your Account Number:{" "}
            <span className="font-medium">{data.Account_num}</span>
          </p>
        )}
      </div>
    </div>
  );
}
