import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Booking.css";

const Booking = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL;

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch car details on mount
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`${API}/api/cars/${carId}`);
        setCar(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [carId]);

  // Calculate total price
  useEffect(() => {
    if (startDate && endDate && car?.pricePerDay) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      if (days > 0) {
        setTotalPrice(days * car.pricePerDay);
        setError("");
      } else {
        setTotalPrice(0);
        setError("Invalid rental dates.");
      }
    }
  }, [startDate, endDate, car]);

  const handleBooking = async () => {
    try {
      if (!startDate || !endDate) {
        setError("Please select both start and end dates.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(
        `${API}/api/bookings`,
        {
          carId,
          startDate,
          endDate,
        },
        { headers }
      );

      setMessage("Booking successful!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to book the car.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error && !car) return <p className="error">{error}</p>;

  return (
    <div className="booking-container">
      <h1>Book This Car</h1>

      {car && (
        <div className="car-card">
          <img
            src={
              car.image
                ? `${API}/uploads/${car.image}`
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            alt={`${car.make} ${car.model}`}
          />
          <div className="car-info">
            <h2>{car.make} {car.model} ({car.year})</h2>
            <p><strong>Fuel Type:</strong> {car.fuelType}</p>
            <p><strong>Price Per Day:</strong> ${car.pricePerDay}</p>
          </div>
        </div>
      )}

      <div className="booking-form">
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <p><strong>Total Price:</strong> ${totalPrice}</p>

        <button className="confirm-button" onClick={handleBooking}>
          Confirm Booking
        </button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Booking;
