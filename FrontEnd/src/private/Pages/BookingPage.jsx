import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Fetch car details by ID
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
    fetchCar();
  }, [carId]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    // Gather booking info from form inputs (you can expand this)
    // Then send POST request to create a booking/rental
    alert(`Booking submitted for ${car?.make} ${car?.model}`);
    // After booking success:
    navigate('/dashboard'); // or wherever you want
  };

  if (loading) return <p>Loading car details...</p>;
  if (!car) return <p>Car not found</p>;

  return (
    <div className="booking-page">
      <h1>Book {car.make} {car.model}</h1>
      <img src={`${API_BASE}/uploads/${car.image}`} alt={car.model} style={{ width: '300px' }} />
      <p>Fuel Type: {car.fuelType}</p>
      <p>Price per Day: ${car.pricePerDay}</p>

      <form onSubmit={handleBookingSubmit}>
        <label>
          Rental Start Date:
          <input type="date" name="startDate" required />
        </label>
        <label>
          Rental End Date:
          <input type="date" name="endDate" required />
        </label>
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookingPage;
