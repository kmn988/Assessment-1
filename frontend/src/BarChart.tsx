import React from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import type { ChartData } from "chart.js/auto";
import type { Expense } from "./ExpenseTable";

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

const BarChart = ({ data }: any) => {
  const monthlyTotals: number[] = [];
  for (const [key, value] of Object.entries(data)) {
    monthlyTotals.push(Number(value));
  }

  // Sort chronologically
  const sortedEntries = Object.entries(monthlyTotals).sort((a, b) => {
    const toDate = (label: string) => {
      const [mon, year] = label.split(" ");
      return new Date(`${mon} 1, ${year}`).getTime();
    };
    return toDate(a[0]) - toDate(b[0]);
  });

  const labels = sortedEntries.map(([k]) => k);
  const amounts = sortedEntries.map(([, v]) => v);

  const commonDataset = {
    label: "Monthly Spend",
    data: amounts,
    borderColor: "#c8f03c",
    borderWidth: 2,
    pointBackgroundColor: "#c8f03c",
    pointRadius: 4,
    pointHoverRadius: 6,
  };

  const chartData = {
    labels,
    datasets: [
      {
        ...commonDataset,
        backgroundColor: "rgba(200, 240, 60, 0.25)",
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` $${Number(ctx.raw).toFixed(2)}`,
        },
        backgroundColor: "#1e2229",
        titleColor: "#e8eaf0",
        bodyColor: "#e8eaf0",
        borderColor: "#2e3340",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#7a8299",
          font: { family: "DM Mono, monospace", size: 11 },
        },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#7a8299",
          font: { family: "DM Mono, monospace", size: 11 },
          callback: (v: any) => `$${v}`,
        },
      },
    },
  };
  return <></>;
  return <Bar data={chartData} options={options} />;
};

export default BarChart;
