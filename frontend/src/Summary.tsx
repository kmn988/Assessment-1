import React from "react";
import type { Expense } from "./ExpenseTable";

interface SummaryBoxProps {
  data: Expense[];
  prevData: Expense[];
}

const SummaryBox = ({ data, prevData }: SummaryBoxProps) => {
  const total = data.reduce((s, e) => s + Number(e.amount), 0);
  const prevTotal = prevData.reduce((s, e) => s + Number(e.amount), 0);
  const diff = total - prevTotal;
  const diffPct = prevTotal > 0 ? (diff / prevTotal) * 100 : 0;
  const isUp = diff > 0;

  const largest = data.length
    ? data.reduce((a, b) => (Number(a.amount) > Number(b.amount) ? a : b))
    : null;
  const numberOfMonths = data.length / 30;
  const monthlyAvg = total / numberOfMonths;

  const stats = [
    {
      label: "Month Total",
      value: `$${total.toFixed(2)}`,
      sub: `${data.length} transaction${data.length !== 1 ? "s" : ""}`,
      accent: "#c8f03c",
    },
    {
      label: "vs Last Month",
      value: `${isUp ? "+" : ""}$${Math.abs(diff).toFixed(2)}`,
      sub: `${isUp ? "▲" : "▼"} ${Math.abs(diffPct).toFixed(1)}% · Last: $${prevTotal.toFixed(2)}`,
      accent: isUp ? "#ff5f6d" : "#34d399",
    },
    {
      label: "Monthly Average",
      value: `$${monthlyAvg.toFixed(2)}`,
      sub: "Based on 30 days",
      accent: "#5b9cf6",
    },
    {
      label: "Largest Expense",
      value: largest ? `$${Number(largest.amount).toFixed(2)}` : "$0.00",
      sub: largest ? largest.title : "—",
      accent: "#f472b6",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, sub, accent }) => (
        <div
          key={label}
          className="relative bg-gray-800 border border-gray-700 rounded-xl p-4 overflow-hidden"
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ backgroundColor: accent }}
          />

          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            {label}
          </p>
          <p
            className="text-2xl font-semibold"
            style={{ color: label === "vs Last Month" ? accent : "white" }}
          >
            {value}
          </p>
          <p className="text-xs text-gray-400 mt-1 truncate">{sub}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryBox;
