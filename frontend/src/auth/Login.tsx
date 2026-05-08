import { useState } from "react";
import axios from "axios";
import "./Login.css";

interface LoginProps {
  goToRegister: () => void;
}

export default function Login({ goToRegister }: LoginProps) {
  // save email and password in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login function
  const handleLogin = async () => {
    try {
      // Call backend login API
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      // get token
      const token = response.data.access_token;

      // save to localStorage
      localStorage.setItem("token", token);

      alert("Login successful");

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };


return (
  <div className="login-page">
    <div className="login-modal">
      <h1 className="login-title">Welcome back</h1>
      <p className="login-subtitle">Sign in to Expense Tracker</p>

      <form className="login-form space-y-5">
        <div className="login-field">
          <label className="login-label">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label className="login-label">Password</label>
          <input
            type="password"
            placeholder="........"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="login-link-row">
          <button type="button" className="login-link">
            Forgot password?
          </button>
        </div>

        <button type="submit" className="login-submit" onClick={(e) => {
          e.preventDefault();
          handleLogin();
        }}>
          Sign in
        </button>
      </form>

      <p className="login-footer">
        No account?{" "}
        <button type="button" className="login-footer-link" onClick={goToRegister}>
          Create one
        </button>
      </p>
    </div>
  </div>
);


}
