"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "./dialog";
import { useState } from "react";
import PinForm from "./pin-form";

const sendMoneySchema = z.object({
  account_number: z
    .string()
    .max(10)
    .min(10, { message: "Account number must be exactly 10 digits" }),
  amount: z.string(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof sendMoneySchema>;

export default function SendMoney() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(sendMoneySchema) });
  const onSubmit = handleSubmit((data) => {
    console.log(data);
    setOpen(true);
  });
  const handleClose = () => setOpen(false);
  const handleOk = () => {
    console.log("Payment confirmed!");
    setOpen(false);
  };

  return (
    <>
      <Dialog
        title="Reminder"
        onClose={handleClose}
        onOk={handleOk}
        open={open}
      >
        <div className="space-y-2 text-[15px]">
          <p className="text-[11px] md:text-sm text-gray-500 mt-2">
            Double check the transfer details before you proceed. Please note
            that successful transfers cannot be reversed
          </p>
          <p>
            <strong>Account Number:</strong> Account
          </p>
          <p>
            <strong>Amount:</strong> Amount
          </p>
          <p>
            <strong>Description:</strong> Desc
          </p>
          <div className="mt-4 mb-8">
            <PinForm />
          </div>
        </div>
      </Dialog>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-xl mx-auto px-6 py-8 md:px-10 md:py-12"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-cyan-900">
            Transfer to SwiftPay Account
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            Enter the recipient details below to continue your transfer
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className=" text-[16px] md:text-[17px] font-medium text-gray-800 mb-2">
              Recipient's Account Number
            </label>
            <input
              type="text"
              {...register("account_number")}
              placeholder="Enter a valid 10-digit account number"
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />
            {errors.account_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.account_number.message}
              </p>
            )}
          </div>

          <div>
            <label className=" text-[16px] md:text-[17px] font-medium text-gray-800 mb-2">
              Amount
            </label>
            <input
              type="number"
              {...register("amount")}
              placeholder="$10.00 - 500,000.00"
              className="w-full border border-gray-300  rounded-md px-4 py-3 "
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className=" text-[16px] md:text-[17px] font-medium text-gray-800 mb-2">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="text"
              {...register("description")}
              placeholder="What's this for?"
              className="w-full border border-gray-300 rounded-md px-4 py-3"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-cyan-900 hover:bg-cyan-800 text-white py-3 rounded-md text-[16px] font-semibold "
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
