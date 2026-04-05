import { useState } from "react";

interface YearSelectorProps {
  value: number;
  onChange: (year: number) => void;
}

const YearSelector = ({ value, onChange }: YearSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const [offset, setOffset] = useState(0);

  // 9 years centered on currentYear + offset
  const centerYear = currentYear + offset;
  const startYear = centerYear - 4;
  const years = Array.from({ length: 9 }, (_, i) => startYear + i);

  const handleSelect = (year: number) => {
    onChange(year);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 border border-gray-600 rounded-lg hover:border-gray-400 transition-colors text-white"
      >
        <span className="text-lg md:text-2xl">{value}</span>
        <span
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-xl overflow-hidden"
          style={{ minWidth: 200 }}
        >
          {/* Navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <button
              onClick={() => setOffset((o) => o - 9)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            >
              ‹
            </button>
            <span className="text-xs text-gray-400">
              {years[0]} — {years[8]}
            </span>
            <button
              onClick={() => setOffset((o) => o + 9)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            >
              ›
            </button>
          </div>

          {/* 3x3 Grid */}
          <div className="grid grid-cols-3 gap-1 p-3">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleSelect(year)}
                disabled={year > currentYear || year == value}
                className={`py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    value === year
                      ? "bg-[#c8f03c] text-black"
                      : year === currentYear
                        ? "border border-gray-500 text-white hover:bg-gray-700"
                        : year > currentYear
                          ? "text-gray-600 "
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default YearSelector;
