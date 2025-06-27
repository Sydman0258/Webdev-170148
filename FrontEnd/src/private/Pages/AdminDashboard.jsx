import React, { useEffect, useState } from "react";
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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!stats) return null;

  const months = stats.profitByMonth.map((item) => item.month);
  const profits = stats.profitByMonth.map((item) => Number(item.total_profit));

  const data = {
    labels: months,
    datasets: [
      {
        label: "Monthly Profit ($)",
        data: profits,
        backgroundColor: "rgba(229, 180, 105, 0.7)",
      },
    ],
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Inter', sans-serif", background: "#272727", minHeight: "100vh", color: "#D4AA7D" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", marginBottom: "2rem", color: "#EFD09E" }}>
        Admin Dashboard
      </h1>

      <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", flexWrap: "wrap" }}>
        <StatCard title="Total Profit" value={`$${stats.totalProfit.toFixed(2)}`} />
        <StatCard title="Active Rentals" value={stats.activeRentals} />
        <StatCard title="Total Rentals" value={stats.totalRentals} />
      </div>

      <div style={{ backgroundColor: "#1f1f1f", padding: "2rem", borderRadius: "1rem", boxShadow: "0 10px 30px rgba(239, 208, 158, 0.08)" }}>
        <h2 style={{ marginBottom: "1rem", color: "#EFD09E" }}>Monthly Profit</h2>
        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div style={{ backgroundColor: "#EFD09E", color: "#272727", padding: "1.5rem", borderRadius: "1rem", flex: "1", minWidth: "180px", textAlign: "center", boxShadow: "0 8px 20px rgba(239, 208, 158, 0.2)" }}>
    <h3 style={{ marginBottom: "0.5rem" }}>{title}</h3>
    <p style={{ fontSize: "2rem", fontWeight: "700" }}>{value}</p>
  </div>
);

export default AdminDashboard;
