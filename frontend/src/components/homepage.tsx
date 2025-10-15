"use client";

import React from "react";
import { JSX } from "react";
import Header from "./ui/header";
import Hero from "./ui/hero";
import Features from "./ui/features";
import Rewards from "./ui/reward";
import Cta from "./ui/cta";
import Footer from "./ui/footer";

export default function HomePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />
      <Hero />
      <Features />
      <Rewards />
      <Cta />
      <Footer />
    </main>
  );
}
