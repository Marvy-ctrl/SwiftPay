"use client";
import React from "react";
import DeleteDialog from "./dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangeUsername } from "@/hooks/useChangeUsername";
import UserPasswordChange from "./userpasswordchange";
import UserPinChange from "./userpinchange";

const usernameSchema = z.object({
  username: z.string().min(3, { message: "Field is required" }),
});

type FormData = z.infer<typeof usernameSchema>;

export interface usernameData {
  username: string;
}

export interface passwordData {
  old_password: string;
  new_password: string;
}

export interface pinData {
  old_pin: string;
  new_pin: string;
}
export default function Settings() {
  const { mutate, isPending } = useChangeUsername();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(usernameSchema) });
  const onSubmit = handleSubmit((data) => mutate(data));

  const handleClose = () => setOpen(false);

  const handleOk = async () => {
    setOpen(false);
  };

  return (
    <>
      <DeleteDialog
        title="After Successful Account Deletion"
        onClose={handleClose}
        onOk={handleOk}
        open={open}
      >
        <div className="space-y-2">
          <div className="pl-6">
            <ul className="text-[12px] md:text-[14px] text-gray-600  list-disc">
              <li>Permanently unable to log in or use the account</li>
              <li>All Lucky draws will be cleared</li>
              <li>Transactions and Account Information will be cleared</li>
            </ul>
          </div>
        </div>
      </DeleteDialog>
      <div className="flex flex-col justify-center md:pl-8 min-h-[70vh] md:min-h-[50vh] space-y-6">
        <div className="w-full max-w-[600px] p-6 space-y-6">
          <h1 className="text-2xl font-bold">Change Username</h1>
          <div>
            <form onSubmit={onSubmit}>
              <label className="block font-semibold text[18px] mb-6">
                Enter your new Username:
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your new username"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.username.message}
                </p>
              )}
              <div className="mt-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-[200px] bg-cyan-900 hover:bg-cyan-800 text-white text-[18px] font-medium rounded-md px-4 py-2"
                >
                  {isPending ? "Changing..." : "Change Username"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <UserPinChange />
        <UserPasswordChange />
        <div className="border border-black"></div>

        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-[200px] bg-red-600 hover:bg-red-500 text-white text-[18px] font-medium rounded-md px-4 py-2"
          >
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
}
