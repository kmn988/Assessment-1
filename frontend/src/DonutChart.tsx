import React from "react";
import { Doughnut } from "react-chartjs-2";
import type { Expense } from "./ExpenseTable";
import "chart.js/auto";
import type {
  ChartData,
  ChartDataset,
  ChartOptions,
  Plugin,
} from "chart.js/auto";
interface DonutChartProps {
  data: Expense[];
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
const DonutChart = ({ data }: DonutChartProps) => {
  const categoryTotals = data.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
    return acc;
  }, {});
  console.log(categoryTotals);

  const labels = Object.keys(categoryTotals);
  const amounts = Object.values(categoryTotals);

  const datasets: ChartDataset<"doughnut", string[]> = {
    label: "Expense",
    data: amounts.map((amount) => amount.toFixed(2)),
    backgroundColor: COLORS.slice(0, labels.length),
    borderWidth: 0,
    hoverOffset: 6,
  };

  const chartData: ChartData<"doughnut", string[], string> = {
    labels: labels,
    datasets: [datasets],
  };
  const legendMargin: Plugin<"doughnut"> = {
    id: "legendDistance",
    beforeInit(chart: any, args, opts) {
      const originalFit = chart.legend.fit;
      chart.legend.fit = function fit() {
        originalFit.bind(chart.legend)();
        this.width += opts.padding || 0;
      };
    },
  };
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left",
        labels: {
          color: "#7a8299",
          boxWidth: 16,
          padding: 16,
          font: {
            size: 16,
          },
        },
      },
      legendDistance: {
        padding: 50,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` $${Number(ctx.raw).toFixed(2)}`,
        },
        backgroundColor: "#1e2229",
        titleColor: "#e8eaf0",
        bodyColor: "#e8eaf0",
        borderColor: "#2e3340",
        borderWidth: 1,
      },
    },
    cutout: "70%",
  };
  return (
    <div className="w-full h-full pr-10  border-2 border-gray-600 border-solid rounded-2xl">
      <Doughnut data={chartData} options={options} plugins={[legendMargin]} />
    </div>
  );
};

export default DonutChart;
