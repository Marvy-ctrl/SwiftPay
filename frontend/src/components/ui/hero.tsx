import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-cyan-950 ">
          Best way to tracking money
        </h1>
        <p className="mt-5 text-gray-700 max-w-xl">
          Experience modern banking built for your lifestyle. Instant transfers,
          daily rewards, and total control over your finances all in one app.
        </p>

        <div className="mt-8 gap-3 flex">
          <Link href={"/signup"}>
            <button className=" items-center gap-2 justify-center px-3 py-3 rounded-full bg-cyan-900 text-white font-semibold shadow hover:bg-cyan-800">
              Get Started
            </button>
          </Link>
          <a
            href="#features"
            className=" items-center justify-center px-3 py-3 rounded-full border border-cyan-900 text-cyan-900 font-medium hover:bg-white/60"
          >
            Learn More
          </a>
        </div>

        <div className="mt-8 flex items-center gap-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-xs text-gray-500">Trusted by</p>
            <p className="font-semibold">100k+ customers</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-xs text-gray-500">Avg. transfer</p>
            <p className="font-semibold">₦15,200</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Balance</p>
              <p className="text-2xl font-bold">$48,350.00</p>
            </div>
            <div className="bg-gray-100 text-cyan-800 px-3 py-2 rounded-lg text-sm">
              Active
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="col-span-1 bg-cyan-900 text-white py-2 rounded-lg font-medium">
              Send
            </button>
            <button className="col-span-1 border border-slate-200 py-2 rounded-lg">
              Request
            </button>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-500">Daily Reward</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="bg-gray-100 text-cyan-800 px-3 py-2 rounded-lg font-semibold">
                Spin Twice
              </div>
              <div className="text-sm text-gray-600">
                Chance to win cash rewards
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
