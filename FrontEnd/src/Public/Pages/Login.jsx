import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmptyHeader from "./EmptyHeader";
import Footer from "./Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard"); // update as per your route
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <EmptyHeader />
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Login</p>

          {error && <div className="error-message">{error}</div>}

          <input
            placeholder="Username"
            className="username input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            placeholder="Password"
            className="password input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="switch-link">
            Don't have an account? <Link to="/register">Register</Link>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
