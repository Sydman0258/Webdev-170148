import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginHeader from "./LoginHeader";
import Footer from "../../Public/Pages/Footer";

import "../Styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }

    // Fetch cars from backend
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cars`);
        const data = await res.json();
        setCars(data);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      }
    };

    fetchCars();
  }, [navigate]);

 const handleCarClick = (carId) => {
  navigate(`/booking/${carId}`);
};

  return (
    <>
      <LoginHeader />
      <main className="dashboard-main">
        <section className="welcome-section">
          <h1>Welcome, {user?.firstName || user?.username || "User"}</h1>
          <h2>{user?.surname || ""}</h2>
        </section>

        <section className="offer-section">
          <h3>Offers for You</h3>
          <div className="car-list">
            {cars.length === 0 ? (
              <p>No cars available.</p>
            ) : (
              cars.map((car, idx) => (
                <div
                  key={idx}
                  className="car-item"
                  tabIndex={0}
                  aria-label={`View details for ${car.make} ${car.model}`}
                >
                  <img
                    src={
                      car.image
                        ? `${API_BASE}/uploads/${car.image}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={`${car.make} ${car.model}`}
                  />
                  <p>{car.make} {car.model}</p>
                  <p>Fuel Type: {car.fuelType || "N/A"}</p>
                  <p>Price: ${car.pricePerDay}/day</p>
                  <button
                    className="book-button"
                    onClick={() => handleCarClick(car.id)}
                  >
                    Book This
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
