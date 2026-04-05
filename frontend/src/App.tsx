import { useState } from "react";
import "./App.css";
import ExpenseTable from "./logbook/ExpenseTable";
import Menu from "./menu/Menu";
import TrendChart from "./trend/Trend";

function App() {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col md:flex-row w-full">
      <Menu setTab={setTab} tab={tab} />
      {tab === 0 && <ExpenseTable />}
      {tab === 1 && <TrendChart />}
    </div>
  );
}

export default App;
