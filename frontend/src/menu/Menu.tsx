import "./Menu.css";

interface MenuProps {
  setTab: (tab: number) => void;
  tab: number;
  onLogout: () => void;
}

const Menu = ({ setTab, tab, onLogout }: MenuProps) => {
  const tabs = ["Logbook", "Trend"];

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
        onClick={onLogout}
        type="button"
      >
        Logout
      </button>
    </div>
  );
};

export default Menu;
