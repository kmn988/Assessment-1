import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import type { ApiUser } from "./AdminScreen";

interface EditUserActionProps {
  isOpen: boolean;
  onClose: () => void;
  user: ApiUser | null;
  onSubmit: (form: ApiUser) => void;
}

interface FormData {
  name: string;
  email: string;
  id: string;
  role: "ADMIN" | "USER";
}

const EMPTY_FORM: FormData = {
  name: "",
  email: "",
  id: "",
  role: "USER",
};

const EditUserAction = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}: EditUserActionProps) => {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const set = (key: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";

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
      onClick: handleClose,
      color: "bg-gray-500",
      hover: "hover:bg-gray-600",
    },
    {
      name: "Edit",
      onClick: handleSubmit,
      color: "bg-blue-500",
      hover: "hover:bg-blue-600",
    },
  ];

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        id: user.id,
        role: user.role,
      });
    }
    setErrors({});
  }, [user]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="admin-modal-overlay">
        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="admin-modal-title">Edit User</h2>

          <div className="admin-modal-field">
            <label className="admin-modal-label">Full Name</label>
            <input
              className="admin-modal-input"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
            {errors.name && (
              <span className="text-xs text-red-400">{errors.name}</span>
            )}
          </div>

          <div className="admin-modal-field">
            <label className="admin-modal-label">Email</label>
            <input
              className="admin-modal-input"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
            {errors.email && (
              <span className="text-xs text-red-400">{errors.email}</span>
            )}
          </div>

          <div className="flex gap-5 justify-center items-center">
            {actions.map((action) => (
              <button
                key={action.name}
                onClick={action.onClick}
                className={`border-solid border-2 p-2 px-6 rounded-2xl hover:cursor-pointer ${action.hover} ${action.color}`}
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserAction;
