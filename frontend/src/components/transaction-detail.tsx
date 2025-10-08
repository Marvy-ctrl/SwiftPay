"use client";
import React from "react";
import { useSingleTransact } from "@/hooks/useSingleTransact";
import { formatCurrency } from "../../utils/main";

export default function TransactionDetailComponent({ uid }: { uid: string }) {
  const { data, isLoading, error, refetch } = useSingleTransact(uid);
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
      <>
        <p className="text-red-500">Error: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-cyan-900 text-white rounded-md"
        >
          Refresh Transactions
        </button>
      </>
    );
  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh] md:min-h-[80vh] space-y-6">
      <div className="w-full max-w-md text-center bg-gray-100 shadow-md rounded-xl p-6 space-y-6">
        <div>
          <h1 className="text-[18px] font-medium">{data.detail}</h1>
          <p className="font-semibold">{formatCurrency(data.amount)}</p>
          <p
            className={
              data.status === "success"
                ? "text-green-500 font-bold"
                : data.status === "failed"
                ? "text-red-600 font-bold"
                : "text-white font-bold"
            }
          >
            {data.status}
          </p>
        </div>
      </div>
      <div className="w-full max-w-md bg-gray-100 shadow-md rounded-xl p-6 space-y-6">
        <div>
          <h1 className="text-[18px] font-semibold ">Transaction details</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">
            {data.role === "received"
              ? "Sender Details:"
              : "Recipient Details:"}
          </h1>

          <p className="font-medium text-[12px]">
            {data.counterparty.toUpperCase()}
          </p>
        </div>
        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">Transaction Id:</h1>
          <p className="font-medium text-[12px]">{data.uid}</p>
        </div>
        <div className="flex justify-between">
          <h1 className="font-semibold text-[14px]">Transaction Date:</h1>
          <p className="font-medium text-[12px]">
            {new Date(data.created_at).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
