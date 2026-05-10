import { useState } from "react";
import "./Login.css";
import { login } from "../config/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

type DecodedToken = {
  sub: string;
  email: string;
  exp: number;
  role: "ADMIN" | "USER";
};

export default function Login() {
  // save email and password in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await login({ email, password });
      const token = response.access_token ?? response.token;

      const decoded = jwtDecode<DecodedToken>(token);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(decoded));

      if (decoded.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (!error.response) {
          setError("Cannot connect to server. Is the backend running?");
        } else {
          setError(error.response.data?.detail ?? "Invalid email or password.");
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
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

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-footer">
          No account?{" "}
          <button
            type="button"
            className="login-footer-link"
            onClick={() => navigate("/register")}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
