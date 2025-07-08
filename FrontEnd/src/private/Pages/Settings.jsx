import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Settings.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    username: "",
    dob: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { user, payment } = res.data;
        setForm({ ...user, ...payment });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [apiUrl]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${apiUrl}/api/users/profile`, {
        ...form,
        payment: {
          cardNumber: form.cardNumber,
          expiry: form.expiry,
          cvv: form.cvv,
        },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is permanent.")) return;
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${apiUrl}/api/users/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      navigate("/register");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete account.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      <form onSubmit={handleUpdate} className="settings-form">
        <div className="form-section">
          <h2>Edit Profile</h2>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required />
          <input type="text" name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" required />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
          <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
        </div>

        <div className="form-section">
          <h2>Payment Info</h2>
          <input type="text" name="cardNumber" value={form.cardNumber || ""} onChange={handleChange} placeholder="Card Number" />
          <input type="text" name="expiry" value={form.expiry || ""} onChange={handleChange} placeholder="Expiry (MM/YY)" />
          <input type="text" name="cvv" value={form.cvv || ""} onChange={handleChange} placeholder="CVV" />
        </div>

        <button type="submit" className="btn-primary">Update Profile</button>
      </form>

      <button onClick={handleDelete} className="btn-danger">Delete Account</button>

      <button onClick={handleBack} className="btn-secondary">← Go Back</button>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Settings;
