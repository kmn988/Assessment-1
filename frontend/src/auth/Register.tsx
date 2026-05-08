import { useState } from "react";
import axios from "axios";
import "./Register.css";

interface RegisterProps {
  goToLogin: () => void;
}

export default function Register({ goToLogin }: RegisterProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/register", {
        fullName,
        email,
        password,
      });

      alert("Registration successful");
      goToLogin();
    } catch (error) {
      console.error(error);
      alert("Registration failed");
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
