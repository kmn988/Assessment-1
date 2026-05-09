import { useState } from "react";
import "./Login.css";
import { login } from "../config/api";
import {jwtDecode} from "jwt-decode";

type DecodedToken = {
  sub: string;
  email: string;
  exp: number;
  role:"ADMIN" | "USER";
};

interface LoginProps {
  goToRegister: () => void;
}

export default function Login({ goToRegister }: LoginProps) {
  // save email and password in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Login function
const handleLogin = async () => {
  try {
    setErrorMessage("");
    const response = await login({ email, password });
    const token = response.access_token ?? response.token;

    const decoded = jwtDecode<DecodedToken>(token);

    localStorage.setItem("token", token);
    localStorage.setItem("role", decoded.role);
    localStorage.setItem("user", JSON.stringify(decoded));

    if (decoded.role === "ADMIN") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/user";
    }
  } catch (error) {
    console.error(error);
    setErrorMessage("Password or email is incorrect");
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
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              placeholder="........"
              className="login-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
            />
            {errorMessage && <p className="login-error">{errorMessage}</p>}
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
