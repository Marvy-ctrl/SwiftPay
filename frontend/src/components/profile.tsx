"use client";

import React from "react";
// import { useUser } from "@/contexts/UserContext";
import { useUser } from "@/hooks/useUser";
import { formatCurrency } from "../../utils/main";

export default function ProfilePage() {
  const { data: user } = useUser();

  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] md:min-h-[90vh] space-y-6">
      <div className="w-full max-w-md bg-gray-100 shadow-md rounded-xl p-6 space-y-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-800">
          {user?.first_name.charAt(0)}
          {user?.last_name.charAt(0)}
        </div>
        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">
            SwiftPay Account Number:
          </h1>
          <p className="font-medium text-[12px]">{user?.account_number}</p>
        </div>
        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">Account Tier:</h1>
          <p className="font-medium text-[12px]">Tier1</p>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-md bg-gray-100 shadow-md rounded-xl p-6 space-y-6">
        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">Full Name:</h1>
          <p className="font-medium text-[12px]">
            {user?.first_name.toUpperCase()} {user?.last_name.toUpperCase()}
          </p>
        </div>
        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">Username:</h1>
          <p className="font-medium text-[12px]">{user?.username}</p>
        </div>

        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">Email Address:</h1>
          <p className="font-medium text-[12px]">{user?.email}</p>
        </div>
        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">Balance:</h1>
          <p className="font-medium text-[12px]">
            {formatCurrency(user?.balance!)}
          </p>
        </div>
      </div>
    </div>
  );
}
