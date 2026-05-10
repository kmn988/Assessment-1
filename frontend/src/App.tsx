import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminScreen from "./AdminScreen";
import "./App.css";
import Login from "./auth/Login";
import Register from "./auth/Register";
import type { User } from "./config/value";
import ExpenseTable from "./logbook/ExpenseTable";
import Menu from "./menu/Menu";
import TrendChart from "./trend/Trend";
import UserDetail from "./UserDetail";

function App() {
  const [tab, setTab] = useState(0);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTab(0);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row w-full">
                <Menu setTab={setTab} tab={tab} onLogout={handleLogout} />
                {tab === 0 && <ExpenseTable />}
                {tab === 1 && <TrendChart />}
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <div className="flex flex-col md:flex-row w-full">
                <Menu setTab={setTab} tab={tab} onLogout={handleLogout} />
                {tab === 0 && <AdminScreen />}
              </div>
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedAdminRoute>
              <div className="flex flex-col md:flex-row w-full">
                <Menu setTab={setTab} tab={tab} onLogout={handleLogout} />
                {tab === 0 && <UserDetail />}
              </div>
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

const ProtectedRoute = ({ children }: any) => {
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");
  return !user ? <Navigate to="/login" replace /> : children;
};

const ProtectedAdminRoute = ({ children }: any) => {
  const user: User = JSON.parse(localStorage.getItem("user") || "{}");
  return user?.role !== "ADMIN" ? <Navigate to="/login" replace /> : children;
};

function NoMatch() {
  return (
    <div style={{ padding: 20 }}>
      <h2>404: Page Not Found</h2>
    </div>
  );
}
