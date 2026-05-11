import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import AdminScreen from "./admin/AdminScreen";
import "./App.css";
import Login from "./auth/Login";
import Register from "./auth/Register";
import type { User } from "./config/value";
import ExpenseTable from "./logbook/ExpenseTable";
import Menu from "./menu/Menu";
import TrendChart from "./trend/Trend";
import UserDetail from "./admin/UserDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<AppLayout tabs={[<ExpenseTable />, <TrendChart />]} />}
          />
        </Route>

        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="/admin"
            element={<AppLayout tabs={[<AdminScreen />]} />}
          />
          <Route
            path="/admin/users/:id"
            element={<AppLayout tabs={[<UserDetail />]} />}
          />
        </Route>

        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
const getUser = (): User => {
  return JSON.parse(localStorage.getItem("user") || "null");
};
const ProtectedRoute = () => {
  const user = getUser();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const ProtectedAdminRoute = () => {
  const user = getUser();
  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/login" replace />;
};

function NoMatch() {
  return (
    <div style={{ padding: 20 }}>
      <h2>404: Page Not Found</h2>
    </div>
  );
}

const AppLayout = ({ tabs }: { tabs: React.ReactNode[] }) => {
  const [tab, setTab] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <Menu setTab={setTab} tab={tab} onLogout={handleLogout} />
      {tabs[tab]}
    </div>
  );
};
