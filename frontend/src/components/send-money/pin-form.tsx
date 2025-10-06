import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const pinSchema = z.object({
  pin: z.number().min(4).max(4, { message: "pin must be exactly 4 digits" }),
});
type FormData = z.infer<typeof pinSchema>;

export default function PinForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(pinSchema) });
  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enter payment PIN
      </label>
      <input
        type="password"
        {...register("pin")}
        placeholder="Enter your 4-digit PIN"
        className="w-full border border-gray-300 rounded-md px-4 py-2"
      />
      {errors.pin && (
        <p className="text-red-500 text-xs mt-1">{errors.pin.message}</p>
      )}
    </form>
  );
}
