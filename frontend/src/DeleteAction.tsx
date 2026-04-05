import React from "react";
import Modal from "./Modal";
import type { Expense } from "./ExpenseTable";

interface DeleteActionProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  onConfirm: () => void;
}
const DeleteAction = ({
  isOpen,
  onClose,
  expense,
  onConfirm,
}: DeleteActionProps) => {
  const actions = [
    {
      name: "Cancel",
      onClick: onClose,
      color: "bg-gray-500",
      hover: "hover:bg-gray-600",
      border: "border-gray-500",
    },
    {
      name: "Delete",
      onClick: () => {
        onConfirm();
        onClose();
      },
      color: "bg-red-500",
      hover: "hover:bg-red-600",
      border: "border-red-500",
    },
  ];
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="font-bold text-center">
          Delete {expense?.title} Expense?
        </p>
        <p className="text-center">
          Are you sure you want to delete this expense?
        </p>
        <div className="flex gap-5 justify-center items-center">
          {actions.map((action) => (
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

export default DeleteAction;
