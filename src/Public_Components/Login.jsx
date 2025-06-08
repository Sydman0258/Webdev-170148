import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Auth.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-container">
      <form className="auth-form">
        <h2>Login to VROOM TRACK</h2>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="username"
        />
        <label htmlFor="login-password">Password</label>
        <div className="auth-password-row">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="auth-show-btn"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button className="auth-submit-btn" type="submit">
          Login
        </button>
        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;