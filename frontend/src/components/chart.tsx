"use client";
import React from "react";
import { useTransactions } from "@/hooks/useTransaction";

export default function TransactionChart() {
  const [data] = useTransactions();
  const actions = data.return(<div>TransactionChart</div>);
}
