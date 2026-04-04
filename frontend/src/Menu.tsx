import React from "react";
interface MenuProps {
  setTab: (tab: number) => void;
  tab: number;
}
const Menu = ({ setTab, tab }: MenuProps) => {
  const tabs = ["Menu", "Trend"];

  return (
    <div className="w-1/6 max-w-50 bg-gray-800 flex flex-col gap-10">
      <div className="text-2xl font-bold p-4">Expense Tracker</div>
      <div className="w-full text-xl bg-gray-800 hover:cursor-pointer ">
        {tabs.map((tabName, i) => (
          <button
            className={`w-full p-2 hover:cursor-pointer ${tab === i ? "text-black bg-main hover:bg-main" : "hover:bg-gray-700"}`}
            onClick={() => setTab(i)}
            key={i}
          >
            {tabName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Menu;
