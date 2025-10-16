"use client";
import { usePasswordConfirm } from "@/hooks/usePasswordConfirm";
import React, { Suspense } from "react";
import { FaCheck } from "react-icons/fa";
import PasswordForm from "./passwordreset-form";
export interface resetData {
  reset_password: string;
}
export default function ResetConfirm() {
  const { mutate: reset, isPending } = usePasswordConfirm();
  if (isPending)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-black text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-black">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-gray-50 shadow-md rounded-xl p-8 w-[400px] text-center">
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <PasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="min-h-screen flex items-center justify-center bg-white">
  //{" "}
  <div className="flex flex-col justify-between text-center text-black bg-gray-50 w-[500px] h-[300px] shadow-md rounded-xl p-6">
    //{" "}
    <div className="flex flex-col items-center justify-center flex-1">
      //{" "}
      <div className="w-[40px] h-[40px] bg-gray-50 rounded-xl flex justify-center items-center">
        // <FaCheck className="text-green-600 text-3xl font-bold" />
        //{" "}
      </div>
      //{" "}
      <h1 className="font-semibold text-[20px] ">
        // Your password has been reset successfully //{" "}
      </h1>
      // <p className="mt-3">You will be redirected back to login page</p>
      //{" "}
    </div>
    // <div className="text-sm text-gray-500">©2025 Swiftpay</div>
    //{" "}
  </div>
  // <div>// </div>
</div>; */
}
