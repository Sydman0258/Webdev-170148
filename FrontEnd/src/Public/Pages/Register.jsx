import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import EmptyHeader from "./EmptyHeader";
import Footer from "./Footer";
import "../Styles/Auth.css";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      // Optionally clear/reset form or redirect
    } else {
      alert(resData.error || "Registration failed");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};


  return (
    <>
      <EmptyHeader />
      <div className="container">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <p className="title">Register</p>

          <input
            type="text"
            placeholder="First Name"
            className="input"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && <span className="auth-error">{errors.firstName.message}</span>}

          <input
            type="text"
            placeholder="Surname"
            className="input"
            {...register("surname", { required: "Surname is required" })}
          />
          {errors.surname && <span className="auth-error">{errors.surname.message}</span>}

          <input
            type="email"
            placeholder="Email"
            className="input"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <span className="auth-error">{errors.email.message}</span>}

          <input
            type="text"
            placeholder="Username"
            className="input"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <span className="auth-error">{errors.username.message}</span>}

          <input
            type="password"
            placeholder="Password"
            className="input"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
          />
          {errors.password && <span className="auth-error">{errors.password.message}</span>}

          <input
            type="date"
            placeholder="Date of Birth"
            className="input"
            {...register("dob", { required: "Date of birth is required" })}
          />
          {errors.dob && <span className="auth-error">{errors.dob.message}</span>}

          <button className="btn" type="submit">Register</button>

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
