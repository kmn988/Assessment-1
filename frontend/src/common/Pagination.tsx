import React from "react";

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  totalPages: number;
}
const Pagination = ({ page, setPage, total, totalPages }: PaginationProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t-2 border-solid">
      <span className="text-xs text-gray-400">
        Page {page} of {totalPages} · {total} record
        {total !== 1 ? "s" : ""}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs font-medium border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | "...")[]>((acc, p, i, arr) => {
            if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="px-2 py-1.5 text-xs text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setPage(p as number)}
                className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
                  page === p
                    ? "bg-main text-black border-main"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {p}
              </button>
            ),
          )}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs font-medium border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
