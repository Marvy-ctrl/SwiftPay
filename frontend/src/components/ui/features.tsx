import React from "react";
import { FiSend, FiShield, FiBarChart2, FiGift } from "react-icons/fi";

const features = [
  {
    icon: <FiSend size={22} />,
    title: "Instant Transfers",
    desc: "Send money to friends and family instantly with low fees and simple flows.",
  },
  {
    icon: <FiBarChart2 size={22} />,
    title: "Smart Insights",
    desc: "Auto categorised spending and goals so you can save smarter.",
  },
  {
    icon: <FiGift size={22} />,
    title: "Daily Rewards",
    desc: "Spin the Lucky Draw and win bonuses for active users.",
  },
  {
    icon: <FiShield size={22} />,
    title: "Bank-Grade Security",
    desc: "Multi-layer encryption and security to keep your money safe.",
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-cyan-950 mb-6">
        Powerful features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-900 mb-4">
              {f.icon}
            </div>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
