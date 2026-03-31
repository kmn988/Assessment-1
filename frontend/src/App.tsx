import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import ExpenseTable from "./ExpenseTable";
import Menu from "./Menu";
import Trend from "./Trend";

function App() {
  const [tab, setTab] = useState(0);

  // const tabs = ["Menu", "Trend"];

  return (
    <div className="flex w-full h-screen">
      <Menu setTab={setTab} tab={tab} />
      {tab === 0 && <ExpenseTable />}
      {tab === 1 && <Trend />}
    </div>
  );
}

export default App;
