// Import necessary React hooks
import React, { useEffect, useState } from "react";

// React Router hook to navigate between pages
import { useNavigate } from "react-router-dom";

// Axios for making API requests
import axios from "axios";

// Importing chart components for Line and Pie charts
import { Line, Pie } from "react-chartjs-2";

// Import and register specific chart elements from Chart.js
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement, // Required for pie charts
} from "chart.js";

// Import custom styles
import "../Styles/AdminDashboard.css";

// Register required Chart.js components globally
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

// Main Admin Dashboard component
const AdminDashboard = () => {
  // State to hold the fetched statistics
  const [stats, setStats] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to toggle the sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // React Router navigation hook
  const navigate = useNavigate();

  // Fetch admin statistics when the component mounts
  useEffect(() => {
    async function fetchStats() {
      try {
        // Retrieve the auth token from local storage
        const token = localStorage.getItem("token");

        // Make an authenticated request to the backend API
        const response = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Set the fetched stats data
        setStats(response.data);
      } catch (err) {
        // If there's an error, update the error state
        setError("Failed to load dashboard data");
      } finally {
        // Stop showing the loader once done
        setLoading(false);
      }
    }

    // Call the function
    fetchStats();
  }, []);

  // Extract monthly profit data
  const profitByMonth = stats?.profitByMonth || [];

  // Format month names for the X-axis of the chart
  const months = profitByMonth.map((item) =>
    new Date(item.month + "-01").toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  );

  // Extract profit numbers
  const profits = profitByMonth.map((item) => Number(item.total_profit));

  // Extract individual statistics
  const totalProfit = stats?.totalProfit || 0;
  const activeRentals = stats?.activeRentals || 0;
  const totalRentals = stats?.totalRentals || 0;
  const totalCars = stats?.totalCars || 0;
  const bookedCars = stats?.bookedCars || 0;
  const availableCars = stats?.availableCars || 0;

  // Data for Line Chart (Monthly Profit)
  const lineData = {
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

  // Configuration for Line Chart with animation
  const lineOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
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

  // Data for Pie Chart (Car Distribution)
  const pieData = {
    labels: ["Booked Cars", "Available Cars"],
    datasets: [
      {
        label: "Car Distribution",
        data: [bookedCars, availableCars],
        backgroundColor: ["#00BFFF", "#FFD700"], // Blue and gold
        borderColor: ["#0033cc", "#b8860b"],
        borderWidth: 1,
      },
    ],
  };

  // Configuration for Pie Chart with animation
  const pieOptions = {
    responsive: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: "easeOutBounce",
    },
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div className="admin-layout">
      {/* Sidebar navigation */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        {/* Button to toggle sidebar */}
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
          ☰
        </div>

        {/* Navigation links */}
        {isSidebarOpen && (
          <nav className="nav-links">
            <p onClick={() => navigate("/admin/dashboard")}>Dashboard</p>
            <p onClick={() => navigate("/add-rental")}>Add Rental</p>
            <p onClick={() => navigate("/manage-rentals")}>Manage Rentals</p>
            <p onClick={() => navigate("/")}>Logout</p>
          </nav>
        )}
      </aside>

      {/* Main dashboard content */}
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        {/* Loading and error messages */}
        {loading && <p style={{ color: "#EFD09E" }}>Loading dashboard...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Main stats and charts section (only if data is ready) */}
        {!loading && !error && (
          <>
            {/* Quick stat cards */}
            <div className="stats-container">
              <StatCard title="Total Cars" value={totalCars} />
              <StatCard title="Booked Cars" value={bookedCars} />
              <StatCard title="Available Cars" value={availableCars} />
              <StatCard title="Total Profit" value={`$${totalProfit.toFixed(2)}`} />
              <StatCard title="Active Rentals" value={activeRentals} />
              <StatCard title="Total Rentals" value={totalRentals} />
            </div>

            {/* Chart section with pie on left, line on right */}
            <div className="chart-row">
              {/* Pie chart for car distribution */}
              <div className="chart-box">
                <h2>Car Status</h2>
                <Pie data={pieData} options={pieOptions} />
              </div>

              {/* Line chart for monthly profit */}
              <div className="chart-box">
                <h2>Monthly Profit</h2>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Reusable stat card component
const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

// Export the AdminDashboard component for use
export default AdminDashboard;
