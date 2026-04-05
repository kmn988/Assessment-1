import { useState } from "react";
import { MONTHS } from "../config/value";

interface MonthSelectorProps {
  value: { month: number; year: number };
  onChange: (value: { month: number; year: number }) => void;
}

const MonthSelector = ({ value, onChange }: MonthSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value.year);

  const handleSelect = (month: number) => {
    onChange({ month, year: viewYear });
    setIsOpen(false);
  };

  const isSelected = (month: number) =>
    month === value.month && viewYear === value.year;

  const isCurrentMonth = (month: number) => {
    const now = new Date();
    return month === now.getMonth() && viewYear === now.getFullYear();
  };
  const isFutureMonth = (month: number) => {
    if (viewYear > new Date().getFullYear()) {
      return true;
    } else if (viewYear === new Date().getFullYear()) {
      return month >= new Date().getMonth();
    } else {
      return false;
    }
  };

  return (
    <div className="relative w-fit m-7">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-[180px] md:w-[240px] items-center justify-between px-4 py-2 text-sm font-medium bg-gray-800 border border-gray-600 rounded-lg hover:border-gray-400 transition-colors text-white"
      >
        <span className="text-lg md:text-2xl">
          {MONTHS[value.month]} {value.year}
        </span>
        <span
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-xl overflow-hidden"
          style={{ minWidth: 240 }}
        >
          {/* Year navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <button
              onClick={() => setViewYear((y) => y - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-white">{viewYear}</span>
            <button
              onClick={() => setViewYear((y) => y + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            >
              ›
            </button>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-1 p-3">
            {MONTHS.map((month, i) => (
              <button
                key={month}
                onClick={() => handleSelect(i)}
                disabled={isCurrentMonth(i) || isFutureMonth(i)}
                className={`
                  py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isSelected(i)
                      ? "bg-[#c8f03c] text-black"
                      : isCurrentMonth(i)
                        ? "border border-gray-500 text-white hover:bg-gray-700"
                        : isFutureMonth(i)
                          ? "text-gray-500"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white hover:cursor-pointer"
                  }
                `}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default MonthSelector;
