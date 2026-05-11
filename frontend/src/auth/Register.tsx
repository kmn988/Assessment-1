import { useState } from "react";
import { AxiosError } from "axios";
import { register } from "../config/api";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../config/helper";

interface ValidationError {
  type: string;
  loc: string[];
  msg: string;
  input?: any;
}

interface ErrorResponse {
  detail?: string | ValidationError[];
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleFieldError = (errors: ValidationError[]) => {
    const newFieldErrors: { email?: string; password?: string; name?: string } =
      {};

    errors.forEach((err) => {
      const field = err.loc[err.loc.length - 1]; // Get last part of loc array (e.g., "email", "password")
      if (field === "email" || field === "password" || field === "name") {
        newFieldErrors[field] = err.msg;
      }
    });

    setFieldErrors(newFieldErrors);
  };
  const handleEmailChange = (value: string) => {
    setEmail(value);
    const emailError = validateEmail(value);
    setFieldErrors((prev) => ({ ...prev, email: emailError || undefined }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const passwordError = validatePassword(value);
    setFieldErrors((prev) => ({
      ...prev,
      password: passwordError || undefined,
    }));

    if (confirmPassword && confirmPassword === value) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    } else if (confirmPassword && confirmPassword !== value) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password !== value) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };
  const handleRegister = async () => {
    setError("");
    setFieldErrors({});
    setSuccess("");

    // Validate all fields
    const nameError = !name.trim() ? "Full name is required" : undefined;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = !confirmPassword.trim()
      ? "Please confirm your password"
      : password !== confirmPassword
        ? "Passwords do not match"
        : undefined;

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setFieldErrors({
        name: nameError,
        email: emailError || undefined,
        password: passwordError || undefined,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setLoading(true);
    try {
      // API call is still here - this line was NOT removed
      await register({ name, email, password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (!error.response) {
          setError("Cannot connect to server. Is the backend running?");
        } else {
          const responseData = error.response.data as ErrorResponse;

          if (Array.isArray(responseData?.detail)) {
            handleFieldError(responseData.detail);
            setError("Please fix the errors below.");
          } else if (typeof responseData?.detail === "string") {
            setError(responseData.detail);
          } else {
            setError("Registration failed. Please try again.");
          }
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-modal">
        <h1 className="register-title">Create an account</h1>
        <p className="register-subtitle">Start tracking your expenses today!</p>

        <form className="register-form space-y-2">
          <div className="register-field">
            <label className="register-label">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className={`register-input ${fieldErrors.name ? "register-input-error" : ""}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {fieldErrors.name && (
              <p className="register-field-error">{fieldErrors.name}</p>
            )}
          </div>

          <div className="register-field">
            <label className="register-label">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`register-input ${fieldErrors.email ? "register-input-error" : ""}`}
              autoComplete="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {fieldErrors.email && (
              <p className="register-field-error">{fieldErrors.email}</p>
            )}
          </div>

          <div className="register-field">
            <label className="register-label">Password</label>
            <input
              type="password"
              placeholder="........"
              className={`register-input ${fieldErrors.password ? "register-input-error" : ""}`}
              autoComplete="new-password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
            {fieldErrors.password && (
              <p className="register-field-error">{fieldErrors.password}</p>
            )}
          </div>

          <div className="register-field">
            <label className="register-label">Confirm Password</label>
            <input
              type="password"
              placeholder="........"
              className={`register-input ${fieldErrors.confirmPassword ? "register-input-error" : ""}`}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            />
            {fieldErrors.confirmPassword && (
              <p className="register-field-error">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* General error message */}
          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="register-back-button"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
