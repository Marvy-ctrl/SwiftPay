"use client";
import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUserPinChange } from "@/hooks/useUserPinChange";

const pinSchema = z.object({
  old_pin: z.string().min(4, {
    message: "pin must be exactly 4 DIGITS",
  }),
  new_pin: z.string().min(4, {
    message: "pin must be exactly 4 DIGITS",
  }),
});

type FormData = z.infer<typeof pinSchema>;

export default function UserPinChange() {
  const { mutate, isPending } = useUserPinChange();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(pinSchema) });
  const onSubmit = handleSubmit((data) => mutate(data));
  return (
    <div className="w-full max-w-[600px]  p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payment Settings</h1>
      <div>
        <form onSubmit={onSubmit}>
          <label className="block font-semibold text[18px] mb-3">
            Enter your old pin:
          </label>
          <input
            type="text"
            {...register("old_pin")}
            placeholder="Enter your old pin"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          {errors.old_pin && (
            <p className="text-red-500 text-sm mt-2">
              {errors.old_pin.message}
            </p>
          )}
          <label className="block font-semibold text[18px] mt-3 mb-3">
            Enter your new pin:
          </label>
          <input
            type="text"
            {...register("new_pin")}
            placeholder="Enter your new pin"
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
          {errors.new_pin && (
            <p className="text-red-500 text-sm mt-2">
              {errors.new_pin.message}
            </p>
          )}
          <div className=" mt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-[200px] bg-cyan-900 hover:bg-cyan-800 text-white text-[18px] font-medium rounded-md px-4 py-2"
            >
              {isPending ? "Changing pin..." : "Change pin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
