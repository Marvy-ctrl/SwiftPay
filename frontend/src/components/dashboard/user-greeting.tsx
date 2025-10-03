"use client";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { formatCurrency } from "../../../utils/main";

export default function UserGreeting() {
  const { user } = useUser();

  return (
    <main className="">
      <section className="">
        <h1 className="">Welcome {user?.username}</h1>
        <p className="">
          Your account balance is {formatCurrency(user?.balance!)}
        </p>
      </section>
    </main>
  );
}
