import React, { useState } from "react";
import Link from "next/link";

export default function Cta() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between shadow">
        <div>
          <h3 className="text-lg font-bold">Ready to get started?</h3>
          <p className="text-sm text-gray-600">
            Create your account in under a minute.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <Link href={"/signup"}>
            <button className="px-5 py-3 rounded-full bg-cyan-900 text-white font-semibold ">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
