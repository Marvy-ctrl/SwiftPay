import { useTransactions } from "@/hooks/useTransaction";
import React from "react";
import { Chart } from "react-google-charts";

export default function ChartComponent() {
  const { data: transactions } = useTransactions();
  const debit = transactions?.filter((tx: any) => tx.role === "sent");
  const credit = transactions?.filter(
    (tx: any) => tx.role === "received" && tx.transfer_type === "transfer"
  );
  const dailyDraw = transactions?.filter(
    (tx: any) => tx.counterparty === "LuckyDraw"
  );

  const debitLength = debit?.length ?? 0;
  const creditLength = credit?.length ?? 0;
  const dailyDrawLength = dailyDraw?.length ?? 0;

  const action = [
    ["Categories", "categories"],
    ["Credit", creditLength],
    ["Debit", debitLength],
    ["Lucky draw", dailyDrawLength],
  ];

  const options = {
    title: "My Daily Transactions",
    pieHole: 0.4,
    is3D: false,
    titleTextStyle: {
      fontSize: 20,
      bold: true,
    },
    legend: {
      textStyle: {
        fontSize: 14,
      },
    },
    pieSliceTextStyle: {
      fontSize: 10,
      bold: true,
    },
  };
  return (
    <div className="w-full h-[400px] md:h-[500px] text-4xl">
      <Chart
        chartType="PieChart"
        width="100%"
        height="100%"
        data={action}
        options={options}
      />
    </div>
  );
}
