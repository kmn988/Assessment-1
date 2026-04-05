import type { Expense } from "../logbook/ExpenseTable";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Health",
  "Housing",
  "Education",
  "Clothing",
  "Exercise",
  "Entertainment",
  "Utilities",
  "Other",
];

export const COLORS = [
  "#fb923c",
  "#5b9cf6",
  "#a78bfa",
  "#f472b6",
  "#34d399",
  "#fbbf24",
  "#19a5fa",
  "#94a3b8",
  "#5439f6",
  "#88f5f9",
];
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const PAGE_SIZE = 10;
export type SortKey = keyof Pick<
  Expense,
  "title" | "category" | "date" | "amount"
>;
export type SortDir = "asc" | "desc";
export const COLS: { label: string; key: SortKey }[] = [
  { label: "Title / Description", key: "title" },
  { label: "Category", key: "category" },
  { label: "Date", key: "date" },
  { label: "Amount", key: "amount" },
];
