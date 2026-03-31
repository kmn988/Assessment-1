import React from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";
import type { ChartData } from "chart.js/auto";

const BarChart = () => {
  const data: ChartData<"bar", number[], string> = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Expense",

        data: [12, 19, 3, 5, 2, 3, 5, 2, 3, 5, 2, 3],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  return <Bar data={data} />;
};

export default BarChart;
