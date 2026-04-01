import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import type { Expense } from "./ExpenseTable";
import BarChart from "./BarChart";
import SummaryBox from "./Summary";
import axiosInstance from "./config/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

interface TrendChartProps {
  tab: number;
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type ChartType = "bar" | "line";

const TrendChart = ({ tab }: TrendChartProps) => {
  const [expenses, setExpenses] = useState();

  // const now = new Date();
  // const currentMonthData = expenses.filter((e) => {
  //   const d = new Date(e.date);
  //   return (
  //     d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  //   );
  // });

  // const prevMonthData = expenses.filter((e) => {
  //   const d = new Date(e.date);
  //   const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  //   const prevYear =
  //     now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  //   return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
  // });

  useEffect(() => {
    axiosInstance.get("/trends", { params: { year: 2026 } }).then((res) => {
      setExpenses(res.data);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full m-7">
      {/* <SummaryBox data={currentMonthData} prevData={prevMonthData} /> */}
      {expenses && (
        <div style={{ position: "relative", height: 240 }}>
          <BarChart data={expenses} />
        </div>
      )}

      {/* Summary row */}
      {/* <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-700">
        {[
          {
            label: "Total",
            value: `$${amounts.reduce((s, v) => s + v, 0).toFixed(2)}`,
          },
          {
            label: "Monthly avg",
            value: `$${amounts.length ? (amounts.reduce((s, v) => s + v, 0) / amounts.length).toFixed(2) : "0.00"}`,
          },
          {
            label: "Highest month",
            value: `$${amounts.length ? Math.max(...amounts).toFixed(2) : "0.00"}`,
          },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-sm font-semibold text-white">{value}</span>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default TrendChart;
