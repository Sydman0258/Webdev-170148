import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "../Styles/AdminDashboard.css";

// Register chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Admin stats data:", response.data);
        setStats(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Extract and format data for chart
  const profitByMonth = stats?.profitByMonth || [];
  const months = profitByMonth.map((item) =>
    new Date(item.month + "-01").toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  );
  const profits = profitByMonth.map((item) => Number(item.total_profit));

  const totalProfit = stats?.totalProfit || 0;
  const activeRentals = stats?.activeRentals || 0;
  const totalRentals = stats?.totalRentals || 0;
  const totalCars = stats?.totalCars || 0;
  const bookedCars = stats?.bookedCars || 0;
  const availableCars = stats?.availableCars || 0;

  const data = {
    labels: months,
    datasets: [
      {
        label: "Monthly Profit ($)",
        data: profits,
        borderColor: "rgba(175, 19, 218, 1)",
        backgroundColor: "rgba(175, 19, 218, 0.2)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "rgba(175, 19, 218, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        title: {
          display: true,
          text: "Profit ($)",
        },
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
          ☰
        </div>
        {isSidebarOpen && (
          <nav className="nav-links">
            <p onClick={() => navigate("/admin")}>Dashboard</p>
            <p onClick={() => navigate("/add-rental")}>Add Rental</p>
            <p onClick={() => navigate("/manage-rentals")}>Manage Rentals</p>
            <p onClick={() => navigate("/")}>Logout</p>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        {loading && <p style={{ color: "#EFD09E" }}>Loading dashboard...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div className="stats-container">
              <StatCard title="Total Cars" value={totalCars} />
              <StatCard title="Booked Cars" value={bookedCars} />
              <StatCard title="Available Cars" value={availableCars} />
              <StatCard title="Total Profit" value={`$${totalProfit.toFixed(2)}`} />
              <StatCard title="Active Rentals" value={activeRentals} />
              <StatCard title="Total Rentals" value={totalRentals} />
            </div>

            <div className="chart-container">
              <h2>Monthly Profit</h2>
              <Line data={data} options={chartOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default AdminDashboard;
