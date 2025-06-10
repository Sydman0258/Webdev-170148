import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import EmptyHeader from "./EmptyHeader";
import Footer from "./Footer";
import "./Auth.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    // Handle registration logic here
    console.log(data);
  };

  return (
    <>
      <EmptyHeader />
      <div className="container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <p className="title">Register</p>
          <input
            type="email"
            placeholder="Email"
            className="input"
            autoComplete="username"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <span className="auth-error">{errors.email.message}</span>}
        
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
            />
           
        
          {errors.password && <span className="auth-error">{errors.password.message}</span>}
      
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="input"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value =>
                  value === watch("password") || "Passwords do not match"
              })}
            />
           
          
          {errors.confirmPassword && <span className="auth-error">{errors.confirmPassword.message}</span>}
          <button className="btn" type="submit">
            Register
          </button>
          <div className="switch-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;