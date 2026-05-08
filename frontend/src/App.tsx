import { useState } from "react";
import "./App.css";
import ExpenseTable from "./logbook/ExpenseTable";
import Menu from "./menu/Menu";
import TrendChart from "./trend/Trend";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AdminScreen from "./AdminScreen";

function App() {
  const [tab, setTab] = useState(0);
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return authPage === "login" ? (
      <Login goToRegister={() => setAuthPage("register")} />
    ) : (
      <Register goToLogin={() => setAuthPage("login")} />
    );
  }

  if (role === "ADMIN") {
    return <AdminScreen />;
  }

  return (
    <div className="flex flex-col md:flex-row w-full">
      <Menu setTab={setTab} tab={tab} />
      {tab === 0 && <ExpenseTable />}
      {tab === 1 && <TrendChart />}
    </div>
  );
}

export default App;
