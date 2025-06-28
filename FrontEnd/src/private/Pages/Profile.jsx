import React from "react";

const ProfileDisplay = ({ user }) => {
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      <div className="profile-card">
        {/* Personal Info Section */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Surname:</strong> {user.surname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Date of Birth:</strong> {user.dob}</p>
        </div>

        {/* Payment Info Section */}
        <div className="profile-section">
          <h2>Payment Information</h2>
          <p><strong>Card Number:</strong> {user.cardNumber || "N/A"}</p>
          <p><strong>Expiry:</strong> {user.expiry || "N/A"}</p>
          <p><strong>CVV:</strong> {user.cvv ? "•••" : "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
