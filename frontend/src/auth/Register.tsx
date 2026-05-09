import { useState } from "react";
import { AxiosError } from "axios";
import { register } from "../config/api";
import "./Register.css";

interface RegisterProps {
  goToLogin: () => void;
}

export default function Register({ goToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      await register({
        name,
        email,
        password,
      });

      alert("Registration successful");
      goToLogin();
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        setErrorMessage(error.response?.data?.detail ?? "Registration failed");
        return;
      }

      setErrorMessage("Registration failed");
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
              className="register-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>
          <div className="register-field">
            <label className="register-label">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="register-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Password</label>
            <input
              type="password"
              placeholder="........"
              className="register-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Confirm Password</label>
            <input
              type="password"
              placeholder="........"
              className="register-input"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMessage("");
              }}
            />
            {errorMessage && <p className="register-error">{errorMessage}</p>}
          </div>

          <div className="register-link-row">
            <button type="button" className="register-link">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="register-submit"
            onClick={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            Create Account
          </button>
        </form>

        <button onClick={goToLogin} className="register-back-button">
          Back to login
        </button>
      </div>
    </div>
  );
}
