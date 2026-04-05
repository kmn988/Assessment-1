import React from "react";
interface MenuProps {
  setTab: (tab: number) => void;
  tab: number;
}
const Menu = ({ setTab, tab }: MenuProps) => {
  const tabs = ["Menu", "Trend"];

  return (
    <div className="w-full md:w-1/6 md:max-w-50 bg-gray-800 flex flex-col md:gap-10">
      <div className="text-xl md:text-2xl font-bold p-4">Expense Tracker</div>
      <div className="w-full text-xl bg-gray-800 hover:cursor-pointer flex md:flex-col overflow-x-auto ">
        {tabs.map((tabName, i) => (
          <button
            className={`px-4 md:w-full p-2 hover:cursor-pointer ${tab === i ? "text-black bg-main hover:bg-main" : "hover:bg-gray-700"}`}
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
