import React, { useState } from "react";
// Importing React and useState hook for managing component state

import '../Styles/AuthForm.css'; // import CSS
// Importing styles specific to the auth form

import EmptyHeader  from "./EmptyHeader";
// Importing a minimal header (likely used for cleaner layout on auth pages)

import Footer from "./Footer";
// Importing Footer component

const ForgotPassword = () => {
  // Functional component definition

  const [email, setEmail] = useState("");
  // State to store the user's email input

  const [message, setMessage] = useState("");
  // State to display a success or error message after form submission

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior (page reload)

    try {
      // Sending POST request to backend to initiate password reset
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST", // HTTP method
        headers: { "Content-Type": "application/json" }, // Sending JSON data
        body: JSON.stringify({ email }), // Sending email as request body
      });

      const data = await res.json(); // Parsing JSON response
      setMessage(data.message); // Set success message from backend
    } catch (err) {
      setMessage("Something went wrong."); // Set fallback error message
    }
  };

  return (
    <>  
      <EmptyHeader />
      {/* Render EmptyHeader at the top (minimal version of header) */}
   
      <div className="auth-container">
        {/* Main container with auth-related styles */}
        
        <h2>Forgot Password</h2>
        {/* Heading */}

        <form onSubmit={handleSubmit}>
          {/* Form element with submit handler */}

          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Controlled input field for email */}

          <button type="submit">Send Reset Link</button>
          {/* Submit button to trigger password reset */}
        </form>

        {message && <p className="message">{message}</p>}
        {/* Conditionally render message (error or success) */}
      </div>

      <Footer />
      {/* Footer at the bottom of the page */}
    </>
  );
};

export default ForgotPassword;
// Exporting component so it can be used in routes or other components
