"use client";

import React, { useRef, useState } from "react";
import { ImGift } from "react-icons/im";
import { useLuckydraw } from "@/hooks/useLuckydraw";

import { formatCurrency } from "../../utils/main";

export default function LuckyDraw() {
  const wheelRef = useRef<HTMLDivElement>(null);
  const { statsQuery, playDrawMutation } = useLuckydraw();
  const [isSpinning, setIsSpinning] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const [drawsLeft, setDrawsLeft] = useState<number | null>(null);

  React.useEffect(() => {
    if (statsQuery.data?.draws_left !== undefined) {
      setDrawsLeft(statsQuery.data.draws_left);
    }
  }, [statsQuery.data]);

  const handleSpin = async () => {
    if (isSpinning || drawsLeft === 0) return;

    const wheel = wheelRef.current;
    if (!wheel) return;

    setIsSpinning(true);
    setPrize(null);
    wheel.classList.add("animate-[spin_3s_ease-in-out]");

    try {
      const result = await playDrawMutation.mutateAsync();

      if (result?.message === "No draws left today") {
        setPrize("No draws left today! Come back tomorrow.");
      } else {
        setPrize(result.won);
        setDrawsLeft(result.draws_left);
      }
    } catch (error: any) {
      setPrize(error.message || "Something went wrong!");
    } finally {
      setTimeout(() => {
        wheel.classList.remove("animate-[spin_3s_ease-in-out]");
        setIsSpinning(false);
      }, 2000);
    }
  };

  const spinsRemaining =
    drawsLeft !== null ? `You have ${drawsLeft} spins left today.` : "";

  return (
    <div className="flex flex-col justify-center items-center p-6 text-center">
      <div className="bg-gray-100 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-cyan-900 mb-2">Lucky Draw</h1>
        <p className="text-gray-600 mb-4">
          Spin the wheel and win exclusive rewards! You can only spin twice per
          day.
        </p>
        {spinsRemaining && (
          <p className="text-sm text-cyan-800 mb-6">{spinsRemaining}</p>
        )}

        <div className="flex justify-center items-center mb-6 relative">
          <div
            ref={wheelRef}
            className="w-[180px] h-[180px] border-[10px] border-cyan-900 rounded-full flex justify-center items-center text-5xl text-cyan-900 relative"
          >
            <ImGift />
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-transparent border-b-cyan-900"></div>
          </div>
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning || drawsLeft === 0}
          className={`px-6 py-3 rounded-md text-white font-semibold transition-all duration-300 ${
            isSpinning || drawsLeft === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-cyan-900 hover:bg-cyan-800"
          }`}
        >
          {isSpinning ? "Spinning..." : "Start Lucky Draw"}
        </button>

        {prize && (
          <div className="mt-6 bg-cyan-900 border border-blue-200 rounded-lg p-4 animate-fadeIn">
            <h2 className="text-xl font-semibold text-white">
              {Number(prize) <= 0 ? "Sorry!" : "Congratulations!"}
            </h2>
            <p className="text-gray-100 mt-2">
              {formatCurrency(Number(prize))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
