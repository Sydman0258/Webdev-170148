import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "../Styles/AdminDashboard.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
        const response = await axios.get("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const profitByMonth = stats?.profitByMonth || [];
  const months = profitByMonth.map((item) => item.month);
  const profits = profitByMonth.map((item) => Number(item.total_profit));

  const totalProfit = stats?.totalProfit || 0;
  const activeRentals = stats?.activeRentals || 0;
  const totalRentals = stats?.totalRentals || 0;

  const data = {
    labels: months,
    datasets: [
      {
        label: "Monthly Profit ($)",
        data: profits,
        backgroundColor: "rgba(175, 19, 218, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
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
              <StatCard title="Total Profit" value={`$${totalProfit.toFixed(2)}`} />
              <StatCard title="Active Rentals" value={activeRentals} />
              <StatCard title="Total Rentals" value={totalRentals} />
            </div>

            <div className="chart-container">
              <h2>Monthly Profit</h2>
              <Bar data={data} options={chartOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default AdminDashboard;
