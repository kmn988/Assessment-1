import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import BarChart from "./BarChart";
import axiosInstance from "./config/axios";
import YearSelector from "./YearSelector";

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

const TrendChart = ({ tab }: TrendChartProps) => {
  const [expenses, setExpenses] = useState();
  const [year, setYear] = useState(new Date().getFullYear());

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
    axiosInstance.get("/trends", { params: { year } }).then((res) => {
      setExpenses(res.data);
    });
  }, [year]);

  return (
    <div className="flex flex-col gap-10 w-full m-3 md:my-4 md:mx-7">
      <div className="text-2xl font-bold">Your monthly trend</div>
      {/* <SummaryBox data={currentMonthData} prevData={prevMonthData} /> */}
      <YearSelector value={year} onChange={setYear} />
      {expenses && (
        <div style={{ position: "relative", height: 400 }}>
          <BarChart year={year} data={expenses} />
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
