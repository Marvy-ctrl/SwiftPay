"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const pinSchema = z.object({
  pin: z
    .string()
    .min(4, { message: "PIN must be exactly 4 digits" })
    .max(4, { message: "PIN must be exactly 4 digits" }),
});

type FormData = z.infer<typeof pinSchema>;

interface PinFormProps {
  onSubmit: (pin: string) => void;
  disabled?: boolean;
  isPending?: boolean;
}

export default function PinForm({
  onSubmit,
  disabled,
  isPending,
}: PinFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(pinSchema),
  });

  // const handleFormSubmit = handleSubmit((data) => onSubmit(data.pin));

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data.pin);
    reset();
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3">
      <label>Enter payment PIN</label>
      <input
        type="password"
        {...register("pin")}
        placeholder="Enter your 4-digit PIN"
        className="w-full border px-4 py-2"
        disabled={disabled}
      />
      {errors.pin && <p>{errors.pin.message}</p>}
      <div className="-mb-16">
        <button
          type="submit"
          className="bg-cyan-900 text-white py-1 px-2 rounded"
          disabled={disabled || isPending}
        >
          {isPending ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </form>
  );
}
