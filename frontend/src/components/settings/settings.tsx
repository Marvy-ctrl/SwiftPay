"use client";
import React from "react";
import DeleteDialog from "./dialog";
import { useState } from "react";

export default function Settings() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleOk = async () => {
    console.log("Account deleted!");
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
            <form action="">
              <label className="block font-semibold text[18px] mb-6">
                Enter your new Username:
              </label>
              <input
                type="text"
                placeholder="Enter your new username"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              <div className=" mt-6">
                <button
                  type="submit"
                  className="w-[200px] bg-cyan-900 hover:bg-cyan-800 text-white text-[18px] font-medium rounded-md px-4 py-2"
                >
                  Change Username
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full max-w-[600px]  p-6 space-y-6">
          <h1 className="text-2xl font-bold">Payment Settings</h1>
          <div>
            <form>
              <label className="block font-semibold text[18px] mb-3">
                Enter your old PIN
              </label>
              <div className="mb-4">
                {" "}
                <input
                  type="password"
                  placeholder="old pin"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
              <label className="block font-semibold text[18px] mb-3">
                Enter your new PIN
              </label>
              <input
                type="password"
                placeholder="new pin"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </form>
          </div>
          <div className=" mt-6">
            <button
              type="submit"
              className="w-[200px] bg-cyan-900 hover:bg-cyan-800 text-white text-[18px] font-medium rounded-md px-4 py-2"
            >
              Change PIN
            </button>
          </div>
        </div>
        <div className="w-full max-w-[600px]  p-6 space-y-6">
          <h1 className="text-2xl font-bold">Login Settings</h1>
          <div>
            <form action="">
              <label className="block font-semibold text[18px] mb-3">
                Enter your old Password:
              </label>
              <input
                type="text"
                placeholder="Enter your old password"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              <label className="block font-semibold text[18px] mt-3 mb-3">
                Enter your new Password:
              </label>
              <input
                type="text"
                placeholder="Enter your new password"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
              <div className=" mt-6">
                <button
                  type="submit"
                  className="w-[200px] bg-cyan-900 hover:bg-cyan-800 text-white text-[18px] font-medium rounded-md px-4 py-2"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
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
      </div>
    </>
  );
}
