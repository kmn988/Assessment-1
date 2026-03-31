import React from "react";
interface MenuProps {
  setTab: (tab: number) => void;
  tab: number;
}
const Menu = ({ setTab, tab }: MenuProps) => {
  return (
    <div className="w-1/4 max-w-75 bg-gray-800 flex flex-col gap-10">
      <div className="text-2xl font-bold p-4">Expense Tracker</div>
      <div className="w-full text-xl text-black bg-gray-800 flex flex-col gap-5">
        <button
          className={`w-full p-2 ${tab === 0 && "text-hover bg-main"}`}
          onClick={() => setTab(0)}
        >
          Menu
        </button>
        <button
          className={`w-full p-2 ${tab === 1 && "text-black bg-main"}`}
          onClick={() => setTab(1)}
        >
          Trend
        </button>
      </div>
    </div>
  );
};

export default Menu;
