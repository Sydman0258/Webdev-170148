import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [payment, setPayment] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [deletingBookingId, setDeletingBookingId] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.user);
        setPayment(res.data.payment);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchProfile();
    fetchBookings();
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    setDeletingBookingId(bookingId);
    try {
      await axios.delete(`${API_BASE}/api/rentals/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted booking from UI
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error) {
      console.error("Failed to delete booking:", error);    
      alert("Failed to delete booking. Please try again.");
    } finally {
      setDeletingBookingId(null);
    }
  };

  if (loadingProfile) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div className="profile-container">
      {/* PROFILE SECTION */}
      <h1>Your Profile</h1>
      <div className="profile-info">
        <p>
          <strong>Name:</strong> {profile.firstName} {profile.surname}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Username:</strong> {profile.username}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {profile.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"}
        </p>
      </div>

      <h2>Payment Information</h2>
      <div className="payment-info">
        <p>
          <strong>Card Number:</strong> {payment?.cardNumber || "Not set"}
        </p>
        <p>
          <strong>Expiry:</strong> {payment?.expiry || "Not set"}
        </p>
        <p>
          <strong>CVV:</strong> {payment?.cvv ? "***" : "not set"}
        </p>
      </div>

      {/* BOOKINGS SECTION */}
      <h1>Your Bookings</h1>
      {loadingBookings && <p>Loading bookings...</p>}
      {!loadingBookings && bookings.length === 0 && <p>You have no bookings yet.</p>}

      <div className="bookings-cards-container">
        {bookings.map((booking) => {
          const car = booking.Car;
          return (
            <div key={booking.id} className="booking-card">
              <img
                src={`${API_BASE}/uploads/${car.image}`}
                alt={`${car.make} ${car.model}`}
                className="car-image"
              />
              <div className="car-info">
                <h3>
                  {car.make} {car.model} ({car.year})
                </h3>
                <p>Fuel Type: {car.fuelType}</p>
                <p>Price per Day: ${car.pricePerDay}</p>
                <p>
                  Rental Dates:{" "}
                  {new Date(booking.rentalDate).toLocaleDateString()} -{" "}
                  {new Date(booking.returnDate).toLocaleDateString()}
                </p>
                <p>Total Price Paid: ${booking.price.toFixed(2)}</p>
                <p>Status: {booking.status}</p>

                <button
                  className="delete-booking-button"
                  disabled={deletingBookingId === booking.id}
                  onClick={() => handleDeleteBooking(booking.id)}
                >
                  {deletingBookingId === booking.id ? "Deleting..." : "Delete Booking"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
