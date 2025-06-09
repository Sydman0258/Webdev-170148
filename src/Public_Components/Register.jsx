import { Link } from "react-router-dom"; // For navigation between pages
import React, { useState } from "react";  // React and useState for local state
import { useForm } from "react-hook-form"; // For form handling and validation
import "./Auth.css"; // Importing styles

const Register = () => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State to toggle confirm password visibility
  const [showConfirm, setShowConfirm] = useState(false);

  // Initialize react-hook-form
  const {
    register,      // Registers input fields for validation
    handleSubmit,  // Handles form submission
    watch,         // Watches input values (used for password match)
    formState: { errors } // Contains validation errors
  } = useForm();

  // Function called on form submit
  const onSubmit = (data) => {
    // Handle registration logic here
    console.log(data);
  };

  return (
    // Main container for the registration form
    <div className="auth-container">
      {/* Registration form with react-hook-form handling */}
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <h2>Create Your Account</h2>
        
        {/* Email field */}
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="username"
          {...register("email", { required: "Email is required" })} // Validation rule
        />
        {/* Show email validation error */}
        {errors.email && <span className="auth-error">{errors.email.message}</span>}
        
        {/* Password field with show/hide toggle */}
        <label htmlFor="register-password">Password</label>
        <div className="auth-password-row">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })} // Validation rules
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
        {/* Show password validation error */}
        {errors.password && <span className="auth-error">{errors.password.message}</span>}
        
        {/* Confirm password field with show/hide toggle */}
        <label htmlFor="register-confirm">Confirm Password</label>
        <div className="auth-password-row">
          <input
            id="register-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm your password"
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: value =>
                value === watch("password") || "Passwords do not match" // Custom validation
            })}
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
        {/* Show confirm password validation error */}
        {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword.message}</span>}
        
        {/* Submit button */}
        <button className="auth-submit-btn" type="submit">
          Register
        </button>
        
        {/* Footer with link to login page */}
        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;