"use client";

import React from "react";
import { useUser } from "@/contexts/UserContext";

export default function UserGreeting() {
  const { user } = useUser();
  return (
    <div>
      <p>welcome {user?.username}</p>
      <p>Your account balance is {user?.balance}</p>
    </div>
  );
}
