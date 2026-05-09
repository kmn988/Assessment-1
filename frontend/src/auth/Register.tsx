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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(goToLogin, 1500);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (!error.response) {
          setError("Cannot connect to server. Is the backend running?");
        } else {
          setError(error.response.data?.detail ?? "Registration failed.");
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
              className="register-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="register-field">
            <label className="register-label">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="register-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Password</label>
            <input
              type="password"
              placeholder="........"
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Confirm Password</label>
            <input
              type="password"
              placeholder="........"
              className="register-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

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

        <button onClick={goToLogin} className="register-back-button">
          Back to login
        </button>
      </div>
    </div>
  );
}
