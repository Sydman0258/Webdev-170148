import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Auth.css";
import Footer from "./Footer";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Handle login logic here
    console.log(data);
  };

  return (
    <>
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Login to VROOM TRACK</h2>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="username"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <span className="auth-error">{errors.email.message}</span>}

          <label htmlFor="login-password">Password</label>
          <div className="auth-password-row">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
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
          {errors.password && <span className="auth-error">{errors.password.message}</span>}

          <button className="auth-submit-btn" type="submit">
            Login
          </button>
          <div className="auth-footer">
            <span>Don't have an account?</span>
            <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;