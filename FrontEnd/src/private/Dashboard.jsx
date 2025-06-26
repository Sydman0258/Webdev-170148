import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginHeader from "./LoginHeader";
import Footer from "../Public_Components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for auth token and user
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <LoginHeader />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1>Welcome, {user?.username || user?.email || "User"} 👋</h1>
          <p>######################################################</p>

          <div className="dashboard-info">
          
            <p><strong>Email:</strong> {user?.email}</p>
            {/* Add more user fields if available */}
          </div>

          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
