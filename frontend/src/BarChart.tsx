import "chart.js/auto";
import { Chart } from "chart.js/auto";
import Annotation from "chartjs-plugin-annotation";
import { Bar } from "react-chartjs-2";

Chart.register(Annotation);
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

const BarChart = ({ year, data }: any) => {
  const monthlyTotals: number[] = MONTHS.map((_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, "0")}`;
    return data[key] ?? 0;
  });
  const average =
    monthlyTotals.reduce((s, e) => s + e, 0) / (Object.keys(data).length || 12);

  const commonDataset = {
    label: "Monthly Spend",
    data: monthlyTotals,
    borderColor: "#c8f03c",
    borderWidth: 2,
    pointBackgroundColor: "#c8f03c",
    pointRadius: 4,
    pointHoverRadius: 6,
  };

  const chartData = {
    labels: MONTHS,
    datasets: [
      {
        ...commonDataset,
        backgroundColor: "rgba(200, 240, 60, 0.25)",
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  const annotation = {
    type: "line" as const,
    yMin: average,
    yMax: average,
    borderColor: "#ff5f6d",
    borderWidth: 1.5,
    label: {
      display: true,
      content: `Avg $${average.toFixed(2)}`,
      position: "end" as const,
      backgroundColor: "#ff5f6d",
      color: "#fff",
      padding: { x: 6, y: 3 },
      borderRadius: 4,
    },
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
      annotation: {
        // drawTime: "afterDatasetsDraw",
        annotations: { annotation },
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
  return <Bar data={chartData} options={options} />;
};

export default BarChart;
