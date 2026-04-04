import React from "react";
import type { Expense } from "./ExpenseTable";

interface CategoryBreakdownProps {
  data: Record<string, number>;
}

const COLORS = [
  "#fb923c",
  "#5b9cf6",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#fbbf24",
  "#60a5fa",
  "#94a3b8",
];

const CategoryBreakdown = ({ data }: CategoryBreakdownProps) => {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-gray-500">
        <span className="text-3xl">📂</span>
        <p className="text-sm">No expenses to break down.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 border-2 border-gray-700 rounded-2xl">
      {sorted.map(([category, amount], i) => {
        const pct = total > 0 ? (amount / total) * 100 : 0;
        const color = COLORS[i % COLORS.length];

        return (
          <div
            key={category}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors cursor-default "
          >
            {/* Color dot */}
            {/* <div className="flex items-center overflow-hidden gap-4"> */}
            <div
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: color }}
            />

            {/* Category name */}
            <span className="text-sm text-gray-300 flex-1 truncate group-hover:text-white transition-colors">
              {category}
            </span>
            {/* </div> */}

            {/* Bar */}
            <div className="w-24 h-1.5 bg-gray-500 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct.toFixed(1)}%`, backgroundColor: color }}
              />
            </div>

            {/* Percentage */}
            <span className="text-xs text-gray-400 w-8 text-right">
              {pct.toFixed(0)}%
            </span>

            {/* Amount */}
            <span className="text-sm text-gray-200 w-16 text-right font-medium">
              ${amount.toFixed(2)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBreakdown;
