import React from "react";
import { useTransactions } from "@/hooks/useTransaction";
import Link from "next/link";
import { formatCurrency } from "../../utils/main";
import { FaGift } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

export default function RecentTransactions() {
  const { data: transactions } = useTransactions();

  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <div className="p-6">
      <div className="flex justify-between ">
        <h2 className="text-xl font-semibold mb-4 mt-2">Recent Transactions</h2>
        <Link href={"/dashboard/transactions"}>
          <button className="text-[16px] font-medium mb-4 underline mt-2 ">
            See All
          </button>
        </Link>
      </div>
      <div className="">
        {recentTransactions.map((item: any) => (
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
