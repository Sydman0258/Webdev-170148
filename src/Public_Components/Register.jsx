import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Auth.css";

const Register = () => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State to toggle confirm password visibility
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    // Container for centering the form
    <div className="auth-container">
      {/* Registration form */}
      <form className="auth-form">
        {/* Form title */}
        <h2>Create Your Account</h2>
        
        {/* Email input */}
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="username"
        />
        
        {/* Password input with show/hide toggle */}
        <label htmlFor="register-password">Password</label>
        <div className="auth-password-row">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            autoComplete="new-password"
          />
          {/* Button to toggle password visibility */}
          <button
            type="button"
            className="auth-show-btn"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        
        {/* Confirm password input with show/hide toggle */}
        <label htmlFor="register-confirm">Confirm Password</label>
        <div className="auth-password-row">
          <input
            id="register-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
          {/* Button to toggle confirm password visibility */}
          <button
            type="button"
            className="auth-show-btn"
            onClick={() => setShowConfirm((v) => !v)}
            tabIndex={-1}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        
        {/* Submit button */}
        <button className="auth-submit-btn" type="submit">
          Register
        </button>
        
        {/* Link to login page */}
       <div className="auth-footer">
  <span>Already have an account?</span>
  <Link to="/login">Login</Link>
</div>
      </form>
    </div>
  );
};

export default Register;