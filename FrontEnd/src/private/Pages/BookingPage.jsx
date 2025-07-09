import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Profile.css";
import { useNavigate } from "react-router-dom";

const ProfileDisplay = () => {
  const [user, setUser] = useState(null);
  const [payment, setPayment] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not logged in.");
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [profileRes, bookingsRes] = await Promise.all([
          axios.get(`${apiUrl}/api/users/profile`, { headers }),
          axios.get(`${apiUrl}/api/rentals/my-bookings`, { headers }),
        ]);

        setUser(profileRes.data.user);
        setPayment(profileRes.data.payment || {});
        setBookings(bookingsRes.data.bookings || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load profile/bookings.");
        setLoading(false);
      }
    };

    fetchProfileAndBookings();
  }, [apiUrl]);

  const handleBack = () => {
    navigate(-1);
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

        {/* Booking Info */}
        <div className="profile-section">
          <h2>Booking Information</h2>
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div key={index} className="booking-card">
                <p><strong>Car:</strong> {booking.Car?.make} {booking.Car?.model} ({booking.Car?.year})</p>
                <p><strong>Fuel Type:</strong> {booking.Car?.fuelType || "N/A"}</p>
                <p><strong>Start Date:</strong> {new Date(booking.rentalDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(booking.returnDate).toLocaleDateString()}</p>
                <p><strong>Total Price:</strong> ${booking.price}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </div>
            ))
          ) : (
            <p>No bookings available.</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="profile-section">
          <h2>Payment Information</h2>
          <p><strong>Card Number:</strong> {payment.cardNumber || "N/A"}</p>
          <p><strong>Expiry:</strong> {payment.expiry || "N/A"}</p>
          <p><strong>CVV:</strong> {payment.cvv ? "•••" : "N/A"}</p>
        </div>
      </div>

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
