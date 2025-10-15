import React from "react";
import { ImGift } from "react-icons/im";
import Link from "next/link";

const testimonials = [
  {
    quote:
      "SwiftPay makes everyday banking delightful — transfers are instant and the rewards are real.",
    author: "Samantha",
  },
  {
    quote:
      "The spending insights helped me find saving opportunities I never noticed before.",
    author: "Precious",
  },
];

export default function Rewards() {
  return (
    <section
      id="rewards"
      className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
    >
      <div className="bg-gradient-to-br from-cyan-900 to-cyan-700 text-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-xl font-bold">Daily Rewards & Lucky Draw</h3>
        <p className="mt-3 text-gray-100/90">
          Spin the Lucky Draw twice every day and win cash that instantly
          credits to your account.
        </p>
        <ul className="mt-6 space-y-3 text-sm list-disc">
          <li> 2 spins per day</li>
          <li>Instant credit to your balance on win</li>
        </ul>
        <Link href={"/login"}>
          <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-cyan-900 font-semibold">
            Try Lucky Draw <ImGift />
          </button>
        </Link>
      </div>

      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-700">{t.quote}</p>
            <div className="mt-3 text-sm text-gray-500">{t.author}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
