import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/Booking.css";

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userCardNumber, setUserCardNumber] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cars/${carId}`);
        if (!res.ok) throw new Error("Failed to fetch car");
        const data = await res.json();
        setCar(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserCardInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.payment?.cardNumber) {
          setUserCardNumber(data.payment.cardNumber);
        } else {
          setUserCardNumber(null);
        }
      } catch (err) {
        console.error("Failed to fetch user card info");
        setUserCardNumber(null);
      }
    };

    fetchCar();
    fetchUserCardInfo();
  }, [carId]);

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays * car.pricePerDay : 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!userCardNumber) {
      alert("You need to have a saved card number in your profile to proceed.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select valid rental start and end dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId,
          startDate,
          endDate,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("Booking successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error submitting booking: " + error.message);
    }
  };

  if (loading) return <p>Loading car details...</p>;
  if (!car) return <p>Car not found</p>;

  return (
    <div className="booking-page">
      <h1>Book {car.make} {car.model}</h1>

      <img
        src={`${API_BASE}/uploads/${car.image}`}
        alt={car.model}
        className="car-image"
      />

      <p className="car-name">{car.make} {car.model}</p>

      <form onSubmit={handleBookingSubmit} className="booking-form">
        <div className="form-group">
          <label>
            Rental Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Rental End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="price-info">
          <p>Price per Day: <strong>${car.pricePerDay}</strong></p>
          <p>Total Price: <strong>${calculateTotalPrice()}</strong></p>
        </div>

        {!userCardNumber && (
          <p className="warning-text">
            You must save a card number in your profile before booking.
          </p>
        )}

        <button type="submit" disabled={!userCardNumber}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
