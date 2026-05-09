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
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token")),
  );

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setTab(0);
    setAuthPage("login");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return authPage === "login" ? (
      <Login goToRegister={() => setAuthPage("register")} />
    ) : (
      <Register goToLogin={() => setAuthPage("login")} />
    );
  }

  if (role === "ADMIN") {
    return <AdminScreen onLogout={handleLogout} />;
  }

  return (
    <div className="flex flex-col md:flex-row w-full">
      <Menu setTab={setTab} tab={tab} onLogout={handleLogout} />
      {tab === 0 && <ExpenseTable />}
      {tab === 1 && <TrendChart />}
    </div>
  );
}

export default App;
