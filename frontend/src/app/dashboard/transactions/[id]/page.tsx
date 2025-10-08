import React from "react";
import TransactionDetailComponent from "@/components/transaction-detail";
export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <TransactionDetailComponent uid={id} />
    </div>
  );
}
