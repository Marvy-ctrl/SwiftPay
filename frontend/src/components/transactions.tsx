"use client";
import { useTransactions } from "@/hooks/useTransaction";
import { formatCurrency } from "../../utils/main";
import Link from "next/link";
import { FaGift } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

export default function Transactions() {
  const { data, isLoading, error, refetch } = useTransactions();

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
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Transactions</h2>

      <div className="">
        {data.map((item: any) => (
          <Link
            key={item.uid}
            href={`/dashboard/transactions/${item.uid}`}
            className="block hover:bg-gray-50"
          >
            <div className="grid grid-cols-3 w-full justify-between mb-3 ">
              <div className="flex gap-2 w-full col-span-2">
                <div>
                  {item.counterparty === "LuckyDraw" ? (
                    <span className="bg-orange-200 w-[25px] h-[25px] rounded-xl flex items-center justify-center">
                      <FaGift className="text-orange-700" />
                    </span>
                  ) : item.role === "received" ? (
                    <span className="bg-gray-300 w-[25px] h-[25px] rounded-xl flex items-center justify-center">
                      <FaArrowDown className="text-green-500" />
                    </span>
                  ) : (
                    <span className="bg-gray-300 w-[25px] h-[25px] rounded-xl flex items-center justify-center">
                      <FaArrowUp className="text-red-500" />
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="truncate w-[150px] md:w-full">
                    {item.counterparty}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right col-span-1">
                <h1 className="font-semibold">{formatCurrency(item.amount)}</h1>

                <p
                  className={
                    item.status === "success"
                      ? "text-green-600"
                      : item.status === "failed"
                      ? "text-red-600"
                      : "text-white"
                  }
                >
                  {item.status}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
