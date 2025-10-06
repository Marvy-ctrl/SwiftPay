"use client";
import { useRef, useEffect, JSX } from "react";
import { IoAlertOutline } from "react-icons/io5";

type Props = {
  title: string;
  onClose: () => void;
  onOk: () => void;
  open: boolean;
  children: React.ReactNode;
};

export default function Dialog({
  title,
  onClose,
  onOk,
  open,
  children,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-xl backdrop:bg-gray-800/50"
    >
      <div className="w-[500px] max-w-full bg-gray-200 flex flex-col">
        <div className="flex justify-between mb-4 pt-2 px-5 bg-gray-200">
          <div className="flex items-center gap-3 mt-6">
            <IoAlertOutline className="text-white bg-orange-400 p-2 rounded-xl text-3xl" />
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </div>
        <div className="px-5 pb-6 mb-6">
          {children}
          <div className="flex justify-between mt-2">
            <button
              onClick={onClose}
              className="bg-cyan-900 text-white py-1 px-2 rounded"
            >
              Recheck
            </button>
            <button
              onClick={onOk}
              className="bg-cyan-900 text-white py-1 px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
