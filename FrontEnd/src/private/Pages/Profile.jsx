// src/Private/Pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginHeader from "./LoginHeader";
import Footer from "../../Public/Pages/Footer";
import "../Styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setFormData(res.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Update failed. Try again.");
    }
  };

  return (
    <>
      <LoginHeader />
      <div className="profile-container">
        <h1>Edit Profile</h1>
        {user ? (
          <div className="profile-form">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
            <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Surname" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
            <input name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth" />
            <button className="save-btn" onClick={handleSave}>Save</button>
            {message && <p className="save-message">{message}</p>}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
