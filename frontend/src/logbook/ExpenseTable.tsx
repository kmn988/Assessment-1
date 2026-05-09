import { useEffect, useState } from "react";
import {
  create_expense,
  delete_expense_by_id,
  get_expense_by_category,
  get_expenses,
  update_expense_by_id,
} from "../config/api";
import { COLS, PAGE_SIZE, type SortDir, type SortKey } from "../config/value";
import CategoryBreakdown from "./CategoryBreakdown";
import CategorySelector from "./CategorySelector";
import ChangeAction from "./ChangeAction";
import DeleteAction from "./DeleteAction";
import DonutChart from "./DonutChart";
import MonthSelector from "./MonthSelector";
import TableBase from "../common/TableBase";

export interface Expense {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: number;
  description: string;
}

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
    const response = await get_expenses({
      month: period.month + 1,
      year: period.year,
      page,
      size: PAGE_SIZE,
      ...(search && { search }),
      ...(selected !== "All" && { category: selected }),
      ...(sort && { sort_key: sort.key, sort_dir: sort.dir }),
    });
    setExpenses(response.items);
    setTotalPages(response.pages);
    setTotal(response.total);
  };
  const fetchExpenseByCategory = async () => {
    const response = await get_expense_by_category({
      month: period.month + 1,
      year: period.year,
    });
    setExpenseByCategory(response);
  };
  const handleCreate = async (form: Omit<Expense, "id">) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    await create_expense({ user_id: user.id, ...form });
    fetchExpenses();
    fetchExpenseByCategory();
  };

  const handleEdit = async (form: Omit<Expense, "id">) => {
    await update_expense_by_id({ id: selectedExpense?.id, params: form });
    fetchExpenses();
    fetchExpenseByCategory();
  };
  const handleDelete = async () => {
    await delete_expense_by_id(selectedExpense?.id);
    fetchExpenses();
    fetchExpenseByCategory();
  };

  useEffect(() => {
    fetchExpenses();
  }, [period, sort, page, selected, search]);

  useEffect(() => {
    setPage(1);
  }, [period, selected]);

  useEffect(() => {
    fetchExpenseByCategory();
  }, [period]);

  return (
    <div className="w-full ">
      <div className="flex justify-between items-center px-4 my-4">
        <div className="flex-1" /> {/* left spacer */}
        <div className="text-2xl font-bold flex-1 text-center">
          Total: ${totalExpense.toFixed(2)}
        </div>
        <div className="flex-1 flex justify-end">
          <button
            className="border-solid border-2 p-2 px-6 rounded-2xl hover:cursor-pointer bg-main hover:bg-hover text-black"
            onClick={() => setShowCreateModal(true)}
          >
            + Add expense
          </button>
        </div>
      </div>
      <ChangeAction
        prevent="Edit"
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        expense={null}
        onSubmit={handleCreate}
      />
      <div>
        <MonthSelector value={period} onChange={(value) => setPeriod(value)} />
        <div className="grid grid-cols-1 md:grid-cols-3 m-3 md:m-7 gap-4 md:gap-7">
          <TableBase
            filterComponent={
              <div className="flex flex-col sm:flex-row flex-wrap p-4 h-auto gap-3 justify-between items-start sm:items-center">
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
            }
            headerComponent={COLS.map((col) => (
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
            bodyComponent={
              <>
                {filtered.map((item) => (
                  <tr className=" border-t-2 h-20 border-solid" key={item.id}>
                    <td className="p-3">
                      <div className=" flex flex-col justify-center gap-1">
                        <span>{item.title}</span>
                        {item.description && (
                          <span className="text-sm text-gray-400">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="rounded-2xl border-2 border-solid w-fit px-2">
                        {item.category}
                      </div>
                    </td>
                    <td className="p-3">{item.date}</td>
                    <td className="p-3 ">
                      <div className=" flex justify-between items-center">
                        <div>{item.amount}</div>
                        <div className="flex gap-2">
                          {actionButtons.map((button) => (
                            <div key={button.title}>
                              <button
                                className="border-solid border-2 rounded-full px-2 hover:cursor-pointer"
                                onClick={() => button.action(item)}
                              >
                                {button.title}
                              </button>
                            </div>
                          ))}
                        </div>
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
                  expense={selectedExpense}
                  onConfirm={handleDelete}
                />
              </>
            }
            page={page}
            setPage={setPage}
            total={total}
            totalPages={totalPages}
          />
          <div className="col-span-1 flex flex-col w-full gap-7">
            <div className=" w-full h-75 ">
              <DonutChart data={expenseByCategory} />
            </div>
            <CategoryBreakdown data={expenseByCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
