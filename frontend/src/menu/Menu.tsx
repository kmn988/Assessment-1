import { useNavigate } from "react-router-dom";
import "./Menu.css";

interface MenuProps {
  setTab: (tab: number) => void;
  tab: number;
  onLogout: () => void;
}

const Menu = ({ setTab, tab, onLogout }: MenuProps) => {
  const userTabs = ["Logbook", "Trend"];
  const adminTabs = ["Users"];
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const tabs = user.role === "ADMIN" ? adminTabs : userTabs;
  const navigate = useNavigate();
  return (
    <div className="menu-shell">
      <div className="menu-brand">Expense Tracker</div>
      <div className="menu-tabs">
        {tabs.map((tabName, i) => (
          <button
            className={`menu-tab ${tab === i ? "menu-tab-active" : ""}`}
            onClick={() => setTab(i)}
            key={i}
            type="button"
          >
            {tabName}
          </button>
        ))}
      </div>
      <button
        className="menu-logout"
        onClick={() => {
          onLogout();
          navigate("/login");
        }}
        type="button"
      >
        Logout
      </button>
    </div>
  );
};

export default Menu;
