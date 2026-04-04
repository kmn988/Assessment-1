import { useEffect, useState } from "react";
import Modal from "./Modal";
import type { Expense } from "./ExpenseTable";

interface ChangeActionProps {
  prevent: string;
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onSubmit: (form: Omit<Expense, "id">) => void;
}
interface FormData {
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}
const CATEGORIES = ["Food", "Exercise", "Entertainment", "Utilities", "Other"];
const EMPTY_FORM: FormData = {
  title: "",
  category: CATEGORIES[0],
  amount: 0,
  date: "",
  description: "",
};

const ChangeAction = ({
  prevent,
  isOpen,
  onClose,
  expense,
  onSubmit,
}: ChangeActionProps) => {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const set = (key: keyof FormData, value: string) => {
    setForm((form) => ({ ...form, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };
  const validate = (): boolean => {
    const newErrors: any = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.amount || isNaN(form.amount) || form.amount <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!form.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    handleClose();
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };
  const actions = [
    {
      name: "Cancel",
      onClick: onClose,
      color: "bg-gray-500",
      hover: "hover:bg-gray-600",
      border: "border-gray-500",
    },
    {
      name: "Edit",
      onClick: handleSubmit,
      color: "bg-blue-500",
      hover: "hover:bg-blue-600",
      border: "border-blue-500",
    },
    {
      name: "Create",
      onClick: handleSubmit,
      color: "bg-red-500",
      hover: "hover:bg-red-600",
      border: "border-red-500",
    },
  ];
  const actionToShow = actions.filter((action) => action.name !== prevent);

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        description: expense.description,
      });
    }
    setErrors({});
  }, [expense]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="font-bold text-center">{`${prevent === "Create" ? "Edit" : "Create"} Expense?`}</p>
        <div>
          <div>New Expense</div>
        </div>
        <div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Grocery run"
              className="border border-gray-600 rounded-lg px-3 py-2 text-sm text-white bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-500"
            />
            {errors.title && (
              <span className="text-xs text-red-400">{errors.title}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="border border-gray-600 rounded-lg px-3 py-2 text-sm text-white bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0.00"
                className="border border-gray-600 rounded-lg px-3 py-2 text-sm text-white bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-500"
              />
              {errors.amount && (
                <span className="text-xs text-red-400">{errors.amount}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Date
              </label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="border border-gray-600 rounded-lg px-3 py-2 text-sm text-white bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.date && (
                <span className="text-xs text-red-400">{errors.date}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Description (optional)
              </label>
              <input
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Add a note…"
                className="border border-gray-600 rounded-lg px-3 py-2 text-sm text-white bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-gray-500"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-5 justify-center items-center">
          {actionToShow.map((action) => (
            <button
              key={action.name}
              onClick={action.onClick}
              className={`border-solid border-2 p-2 px-6 rounded-2xl hover:cursor-pointer ${action.hover} ${action.color} `}
            >
              {action.name}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ChangeAction;
