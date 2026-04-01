import { useState } from "react";
import "./App.css";
import ExpenseTable from "./ExpenseTable";
import Menu from "./Menu";
import TrendChart from "./Trend";

function App() {
  const [tab, setTab] = useState(0);
  // const [expenses, dispatch, isPending] = useActionState<Expense[]>(fetchExpenses,[]);

  return (
    <div className="flex w-full h-screen">
      <Menu setTab={setTab} tab={tab} />
      {tab === 0 && <ExpenseTable />}
      {tab === 1 && <TrendChart tab={tab} />}
    </div>
  );
}

export default App;
