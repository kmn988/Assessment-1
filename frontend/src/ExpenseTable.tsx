import React, { useEffect, useState } from "react";
import DeleteAction from "./DeleteAction";
import ChangeAction from "./ChangeAction";
import DonutChart from "./DonutChart";
import MonthSelector from "./MonthSelector";
import CategoryBreakdown from "./CategoryBreakdown";
import axiosInstance from "./config/axios";
export interface Expense {
  id: number;
  title: string;
  category: string;
  date: string;
  amount: string;
  description: string;
}
interface ExpenseTableProps {
  data: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
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
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      title: "Run",
      category: "Food",
      date: "2022-01-01",
      amount: "100",
      description: "Run",
    },
    {
      id: 2,
      title: "Walk",
      category: "Exercise",
      date: "2022-01-01",
      amount: "100",
      description: "Walk",
    },
    {
      id: 3,
      title: "Watch",
      category: "Entertainment",
      date: "2022-01-01",
      amount: "100",
      description: "Watch",
    },
    {
      id: 4,
      title: "Flat",
      category: "Utilities",
      date: "2022-01-01",
      amount: "100",
      description: "Flat",
    },
  ]);

  const buttons = ["All", "Food", "Exercise", "Entertainment", "Utilities"];
  const filtered = expenses.filter((item) => {
    const matchCategory = selected === "All" || item.category === selected;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });
  const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
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
  const handleCreate = async (form: Omit<Expense, "id">) => {
    const expense: Expense = await axiosInstance.post("/expense/", form);
    setExpenses((prev) => [...prev, { ...form, id: expense.id }]);
  };

  const handleEdit = async (form: Omit<Expense, "id">) => {
    const updatedExpense: Expense = await axiosInstance.put(
      `/expense/${selectedExpense?.id}`,
      form,
    );
    setExpenses((prev) =>
      prev.map((item) =>
        item.id === selectedExpense?.id ? { ...form, id: item.id } : item,
      ),
    );
  };
  const handleDelete = () => {
    setExpenses((prev) =>
      prev.filter((item) => item.id !== selectedExpense?.id),
    );
    setShowDeleteModal(false);
  };

  useEffect(() => {
    axiosInstance
      .get("/expenses", {
        params: {
          month: period.month + 1,
          year: period.year,
        },
      })
      .then((res) => {
        setExpenses(res.data);
      });
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
        <div className="text-2xl font-bold">Total: ${total}</div>
        <MonthSelector value={period} onChange={(value) => setPeriod(value)} />
        {expenses.length === 0 ? (
          <div className="mt-10">
            <div>📋</div>
            <p>No expenses found for this period.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 m-7 gap-7">
            <div className="col-span-2 bg-gray-800 rounded-xl border-2 border-solid">
              <div className="flex p-4 justify-between items-center">
                <div className="flex flex-wrap gap-2 ">
                  {buttons.map((item) => (
                    <div
                      className={`px-2 border-solid border-2 rounded-full hover:cursor-pointer ${selected === item ? "border-main text-main" : ""}`}
                      onClick={() => setSelected(item)}
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Search expenses"
                  className="px-2 border-solid border-2 rounded-2xl h-fit"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <table className="w-full text-left ">
                <thead>
                  <tr className="h-10 border-y-2 border-solid">
                    <th className="p-3">Title / Description</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
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
                      <td className="p-3 flex gap-x-2 ">
                        <div>{item.amount}</div>
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
            </div>
            <div className="col-span-1 flex flex-col w-full gap-7">
              <div className=" w-full h-75 ">
                <DonutChart data={expenses} />
              </div>
              <CategoryBreakdown data={expenses} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
