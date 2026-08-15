import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = "http://localhost:8000/api";

const Login = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* THEME BUTTON */}
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle dark and light mode"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="auth-background">
        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>
      </div>

      <div className="auth-container">
        {/* BRAND */}
        <div className="auth-brand">
          <div className="brand-logo">N</div>
          <span>InvoiceFlow</span>
        </div>

        <div className="auth-card">
          {/* HEADER */}
          <div className="auth-header">
            <h1>Welcome back</h1>

            <p>Sign in to continue to your workspace.</p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="auth-error">
              <span>!</span>
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className="form-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <div className="password-label">
                <label>Password</label>

                <a href="#forgot">Forgot password?</a>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">●</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* REMEMBER */}
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            {/* LOGIN */}
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* GOOGLE */}
          <button className="google-button" type="button">
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          {/* FOOTER */}
          <div className="auth-footer">
            <span>Don't have an account?</span>

            <Link to="/register">Create an account</Link>
          </div>
        </div>

        {/* SECURITY */}
        <div className="auth-security">
          <span>🔒</span>
          Your data is protected with secure authentication
        </div>
      </div>
    </div>
  );
};

export default Login;
