import React, { useEffect, useMemo, useState } from "react";
import DeleteAction from "./DeleteAction";
import ChangeAction from "./ChangeAction";
import DonutChart from "./DonutChart";
import MonthSelector from "./MonthSelector";
import CategoryBreakdown from "./CategoryBreakdown";
import axiosInstance from "./config/axios";
import CategorySelector from "./CategorySelector";
export interface Expense {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
  description: string;
}
const PAGE_SIZE = 10;
type SortKey = keyof Pick<Expense, "title" | "category" | "date" | "amount">;
type SortDir = "asc" | "desc";
const COLS: { label: string; key: SortKey }[] = [
  { label: "Title / Description", key: "title" },
  { label: "Category", key: "category" },
  { label: "Date", key: "date" },
  { label: "Amount", key: "amount" },
];

const ExpenseTable = () => {
  const [selected, setSelected] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null);
  const [expenseByCategory, setExpenseByCategory] = useState({});

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };
  console.log(expenseByCategory);

  const filtered = expenses.filter((item) => {
    const matchCategory = selected === "All" || item.category === selected;
    const matchDate =
      item.date.slice(0, 7) ===
      `${period.year}-${(period.month + 1).toString().padStart(2, "0")}`;

    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch && matchDate;
  });

  const totalExpense = expenses.reduce(
    (acc, item) => acc + Number(item.amount),
    0,
  );
  const actionButtons = [
    {
      title: "Edit",
      action: (item: Expense) => {
        setShowEditModal(true);
        setSelectedExpense(item);
      },
    },
    {
      title: "Delete",
      action: (item: Expense) => {
        setShowDeleteModal(true);
        setSelectedExpense(item);
      },
    },
  ];
  const fetchExpenses = async () => {
    const response = await axiosInstance.get("/expenses", {
      params: {
        month: period.month + 1,
        year: period.year,
        page,
        size: PAGE_SIZE,
        ...(search && { search }),
        ...(selected !== "All" && { category: selected }),
        ...(sort && { sort_key: sort.key, sort_dir: sort.dir }),
      },
    });
    setExpenses(response.data.items);
    setTotalPages(response.data.pages);
    setTotal(response.data.total);
  };
  const fetchExpenseByCategory = async () => {
    const response = await axiosInstance.get("/expense_by_category", {
      params: {
        month: period.month + 1,
        year: period.year,
      },
    });
    setExpenseByCategory(response.data);
  };
  const handleCreate = async (form: Omit<Expense, "id">) => {
    const expense: Expense = await axiosInstance.post("/expense/", form);
    setExpenses((prev) => [...prev, { ...form, id: expense.id }]);
    fetchExpenses();
    fetchExpenseByCategory();
  };

  const handleEdit = async (form: Omit<Expense, "id">) => {
    await axiosInstance.put(`/expense/${selectedExpense?.id}`, form);
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === selectedExpense?.id ? { ...form, id: item.id } : item,
      ),
    );
    fetchExpenses();
    fetchExpenseByCategory();
  };
  const handleDelete = () => {
    setExpenses((prev) =>
      prev.filter((item) => item.id !== selectedExpense?.id),
    );
    setShowDeleteModal(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [period, sort, page, selected, search]);

  useEffect(() => {
    setPage(1);
  }, [period, selected]);

  useEffect(() => {
    fetchExpenseByCategory();
  }, []);
  return (
    <div className="w-full ">
      <div className="flex justify-end m-4">
        <button
          className={`border-solid border-2 p-2 px-6 rounded-2xl hover:cursor-pointer bg-main hover:bg-hover text-black `}
          onClick={() => setShowCreateModal(true)}
        >
          + Add expense
        </button>
        <ChangeAction
          prevent="Edit"
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          expense={null}
          onSubmit={handleCreate}
        />
      </div>
      <div>
        <div className="text-2xl font-bold">Total: ${totalExpense}</div>
        <MonthSelector value={period} onChange={(value) => setPeriod(value)} />
        {expenses.length === 0 ? (
          <div className="mt-10">
            <div>📋</div>
            <p>No expenses found for this period.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 m-7 gap-7">
            <div className="col-span-2 bg-gray-800 flex flex-col rounded-xl border-2 border-solid">
              <div className="flex p-4 h-auto justify-between items-center">
                <div className="flex flex-wrap gap-2 ">
                  <CategorySelector value={selected} onChange={setSelected} />
                </div>
                <input
                  type="text"
                  placeholder="Search expenses"
                  className="px-2 border-solid border-2 rounded-2xl h-fit"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-col h-full justify-between">
                <table className="w-full text-left ">
                  <thead>
                    <tr className="h-10 border-y-2 border-solid">
                      {COLS.map((col) => (
                        <th
                          key={col.key}
                          className="p-3 hover:cursor-pointer select-none hover:text-main transition-colors"
                          onClick={() => toggleSort(col.key)}
                        >
                          <div className="flex items-center gap-1">
                            {col.label}
                            <span className="text-xs text-gray-500">
                              {sort?.key === col.key
                                ? sort.dir === "asc"
                                  ? "▲"
                                  : "▼"
                                : "⇅"}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr className=" border-t-2 border-solid" key={item.id}>
                        <td className="p-3">{item.title}</td>
                        <td className="p-3">
                          <div className="rounded-2xl border-2 border-solid w-fit px-2">
                            {item.category}
                          </div>
                        </td>
                        <td className="p-3">{item.date}</td>
                        <td className="p-3 flex justify-between ">
                          <div>{item.amount}</div>
                          <div className="flex gap-2">
                            {actionButtons.map((button) => (
                              <div>
                                <button
                                  className="border-solid border-2 rounded-full px-2 hover:cursor-pointer"
                                  onClick={() => button.action(item)}
                                  key={button.title}
                                >
                                  {button.title}
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                    <ChangeAction
                      prevent="Create"
                      isOpen={showEditModal}
                      onClose={() => setShowEditModal(false)}
                      expense={selectedExpense}
                      onSubmit={handleEdit}
                    />
                    <DeleteAction
                      isOpen={showDeleteModal}
                      onClose={() => setShowDeleteModal(false)}
                      onConfirm={handleDelete}
                    />
                  </tbody>
                </table>
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
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - page) <= 1,
                      )
                      .reduce<(number | "...")[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1)
                          acc.push("...");
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
                            key={p}
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
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1.5 text-xs font-medium border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 flex flex-col w-full gap-7">
              <div className=" w-full h-75 ">
                <DonutChart data={expenseByCategory} />
              </div>
              <CategoryBreakdown data={expenseByCategory} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
