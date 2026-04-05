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
import axiosInstance from "../config/axios";
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

const TrendChart = () => {
  const [expenses, setExpenses] = useState();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    axiosInstance.get("/trends", { params: { year } }).then((res) => {
      setExpenses(res.data);
    });
  }, [year]);

  return (
    <div className="flex flex-col gap-10 w-full m-3 md:my-4 md:mx-7">
      <div className="text-2xl font-bold">Your monthly trend</div>
      <YearSelector value={year} onChange={setYear} />
      {expenses && (
        <div style={{ position: "relative", height: 400 }}>
          <BarChart year={year} data={expenses} />
        </div>
      )}
    </div>
  );
};

export default TrendChart;
