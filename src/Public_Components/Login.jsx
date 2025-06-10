import React, { useState } from "react";
import { Link } from "react-router-dom";
import EmptyHeader from "./EmptyHeader";
import Footer from "./Footer";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <>
      <EmptyHeader />
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="title">Login Form</p>
          <input
            placeholder="Username"
            className="username input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            className="password input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" type="submit">
            Login
          </button>
          <div className="switch-link">
            Not a user yet? <Link to="/register">Register</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;