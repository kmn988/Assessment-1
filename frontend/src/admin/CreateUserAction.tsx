import { useState } from "react";
import Modal from "../Modal";
import { validateEmail, validatePassword } from "../config/helper";

interface CreateUserActionProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
}

interface FormState extends FormData {
  confirmPassword: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "USER",
};

const CreateUserAction = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateUserActionProps) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";

    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.role) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (value: string) => {
    set("email", value);
    const emailError = validateEmail(value);
    if (emailError) {
      setErrors((e) => ({ ...e, email: emailError }));
    } else {
      setErrors((e) => ({ ...e, email: "" }));
    }
  };
  const handlePasswordChange = (value: string) => {
    set("password", value);

    const passwordError = validatePassword(value);
    if (passwordError) {
      setErrors((e) => ({ ...e, password: passwordError }));
    } else {
      setErrors((e) => ({ ...e, password: "" }));
    }

    if (form.confirmPassword && form.confirmPassword !== value) {
      setErrors((e) => ({ ...e, confirmPassword: "Passwords do not match" }));
    } else if (form.confirmPassword === value) {
      setErrors((e) => ({ ...e, confirmPassword: "" }));
    }
  };
  const handleSubmit = () => {
    if (!validate()) return;
    const { confirmPassword, ...submitForm } = form;
    onSubmit(submitForm);
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
      name: "Create",
      onClick: handleSubmit,
      color: "bg-blue-500",
      hover: "hover:bg-blue-600",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="admin-modal-overlay">
        <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="admin-modal-title">Add User</h2>

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
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {errors.email && (
              <span className="text-xs text-red-400">{errors.email}</span>
            )}
          </div>

          <div className="admin-modal-field">
            <label className="admin-modal-label">Password</label>
            <input
              className="admin-modal-input"
              type="password"
              placeholder="Min 8 chars, 1 upper, 1 digit, 1 special"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {errors.password && (
              <span className="text-xs text-red-400">{errors.password}</span>
            )}
          </div>

          <div className="admin-modal-field">
            <label className="admin-modal-label">Confirm Password</label>
            <input
              className="admin-modal-input"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
            />
            {errors.confirmPassword && (
              <span className="text-xs text-red-400">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="admin-modal-field">
            <label className="admin-modal-label">Role</label>
            <select
              className="admin-modal-input admin-modal-select"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            {errors.role && (
              <span className="text-xs text-red-400">{errors.role}</span>
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

export default CreateUserAction;
