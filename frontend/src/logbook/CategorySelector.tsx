import React, { useState } from "react";
import { CATEGORIES } from "../config/value";

interface CategorySelectorProps {
  value: string;
  onChange: (category: string) => void;
}

const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["All", ...CATEGORIES];
  return (
    <div className="relative w-fit ">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-[240px] items-center justify-between px-4 py-2 text-sm font-medium bg-gray-800 border border-gray-600 rounded-lg hover:border-gray-400 transition-colors text-white"
      >
        <span className="text-2xl">{value}</span>
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
          <div className="grid grid-cols-1 gap-1 p-3">
            {options.map((category, i) => (
              <button
                key={category}
                onClick={() => {
                  onChange(category);
                  setIsOpen(false);
                }}
                className={`
                  py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    value === category
                      ? "bg-[#c8f03c] text-black"
                      : //   : isCurrentMonth(i)
                        //     ? "border border-gray-500 text-white hover:bg-gray-700"
                        "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                {category}
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

export default CategorySelector;
