import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Profile.css"; 
import { useNavigate } from "react-router-dom";

const ProfileDisplay = () => {
  const [user, setUser] = useState(null);
  const [payment, setPayment] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not logged in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiUrl}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
        setPayment(response.data.payment);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [apiUrl]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="profile-container">
      <h1>User Profile</h1>

      <div className="profile-card">
        {/* Personal Info */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Surname:</strong> {user.surname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Date of Birth:</strong> {user.dob}</p>
        </div>

        {/* Payment Info */}
        <div className="profile-section">
          <h2>Payment Information</h2>
          <p><strong>Card Number:</strong> {payment.cardNumber || "N/A"}</p>
          <p><strong>Expiry:</strong> {payment.expiry || "N/A"}</p>
          <p><strong>CVV:</strong> {payment.cvv ? "•••" : "N/A"}</p>
        </div>
      </div>

      {/* Back Button */}
      <button 
        onClick={handleBack} 
        style={{
          marginTop: '2rem',
          padding: '0.6rem 1.2rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#4a90e2',
          color: 'white'
        }}
      >
        ← Back
      </button>
    </div>
  );
};

export default ProfileDisplay;
