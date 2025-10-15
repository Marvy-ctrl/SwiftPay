"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="">
          <Image
            src="/swift-logo.png"
            alt="SwiftPay"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-sm">
        <a href="#features" className="hover:underline">
          Features
        </a>
        <a href="#rewards" className="hover:underline">
          Rewards
        </a>
        <Link href={"/login"}>
          <button className="text-slate-700  hover:underline   ">Login</button>
        </Link>
        <Link href={"/signup"}>
          <button className="px-4 py-2 rounded-full bg-cyan-900 text-white font-medium">
            Sign Up
          </button>
        </Link>
      </nav>

      <div className="md:hidden">
        <Link href={"/signup"}>
          <button className="px-3 py-2 rounded-full bg-cyan-900 text-white text-sm">
            Get Started
          </button>
        </Link>
      </div>
    </header>
  );
}
