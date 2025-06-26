import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginHeader from "./LoginHeader";
import Footer from "../../Public/Pages/Footer";

import rollsroyce from '../../assets/Rolls.png';
import lotus from '../../assets/lotus.png';
import lotus2 from '../../assets/lotus2.png';
import lotus3 from '../../assets/lotus3.png';

import "../Styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleCarClick = (carName) => {
    alert(`You clicked on ${carName}`);
    // You can navigate to car details page or modal here
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
            {[{
              name: "Rolls Royce Phantom",
              image: rollsroyce,
            }, {
              name: "Lotus Elise",
              image: lotus,
            }, {
              name: "Lotus Evora",
              image: lotus2,
            }, {
              name: "Lotus Exige",
              image: lotus3,
            }].map((car, idx) => (
              <div
                key={idx}
                className="car-item"
                onClick={() => handleCarClick(car.name)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === "Enter") handleCarClick(car.name); }}
                aria-label={`View details for ${car.name}`}
              >
                <img src={car.image} alt={car.name} />
                <p>{car.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
