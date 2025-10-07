"use client";
import React from "react";
import { useUser } from "@/hooks/useUser";
import { formatCurrency } from "../../../utils/main";

export default function UserGreeting() {
  const { data: user } = useUser();

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
