"use client";

import React, { useState } from "react";
import Link from "next/link";
import UserGreeting from "./user-greeting";
import { useUser } from "@/contexts/UserContext";
import { redirect } from "next/navigation";
import { formatCurrency } from "../../../utils/main";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { CiCreditCard2 } from "react-icons/ci";
import { FaGift } from "react-icons/fa";
import { Chart } from "react-google-charts";

const data = [
  ["Categories", "categories"],
  ["Sent", 10],
  ["Recieved", 10],
  ["Lucky draw", 5],
];

export const options = {
  title: "My Daily Transactions",
  pieHole: 0.4,
  is3D: false,
  titleTextStyle: {
    fontSize: 20,
    bold: true,
  },
  legend: {
    textStyle: {
      fontSize: 14,
    },
  },
  pieSliceTextStyle: {
    fontSize: 10,
    bold: true,
  },
};
export default function DashboardComponent() {
  const [showBalance, setShowBalance] = useState(false);

  const { user } = useUser();

  return (
    <div className="h-full">
      <div className="text-[16px] font-semibold mb-6 ">
        Hi, {user?.username.toUpperCase()}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8">
        <div className="bg-gray-100 shadow-[2px_0_4px_0_rgba(0,0,0,0.1)] relative z-10 rounded-2xl md:col-span-5  text-black p-6">
          <h1 className="text-2xl font-medium mb-4">Balance</h1>
          <div className="relative flex items-center gap-3">
            <p className="text-3xl font-bold">
              {" "}
              {showBalance ? formatCurrency(user?.balance!) : "****"}
            </p>
            <button
              type="button"
              className="absolute top-9 md:top-12 items-center"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
        <div className="md:col-span-2 p-6 shadow-[2px_0_4px_0_rgba(0,0,0,0.1)] relative z-10   bg-gray-100 rounded-2xl ">
          <h1 className="text-black text-2xl font-medium mb-3">
            Quick actions
          </h1>

          <div className="bg-cyan-900  md:p-4 p-2 text-center font-semibold text-white rounded-[10px]">
            <Link href={"/dashboard/send-money"}>
              <button className="">Send Money</button>
            </Link>
          </div>
          <div className="bg-cyan-900 md:my-4 my-2 text-center font-semibold text-white md:p-4 p-2 rounded-[10px]">
            <Link href={"/dashboard/lucky-draw"}>
              <button>Lucky draw</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 h-full gap-4">
        <div className=" min-h-96 rounded-2xl md:col-span-4 text-black">
          <h1 className="text-2xl font-medium mb-4">Recent Transactions</h1>
        </div>

        <div className="  flex justify-center md:col-span-3">
          <div className="w-full h-[400px] md:h-[500px] text-4xl">
            <Chart
              chartType="PieChart"
              width="100%"
              height="100%"
              data={data}
              options={options}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
