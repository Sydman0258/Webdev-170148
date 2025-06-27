<div className="profile-container">
  <h1>Edit Profile</h1>
  {user ? (
    <div className="profile-card">
      <div className="profile-form">

        {/* Personal Info Section */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <label>First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
          
          <label>Surname</label>
          <input name="surname" value={formData.surname} onChange={handleChange} placeholder="Surname" />
          
          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          
          <label>Username</label>
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
          
          <label>Date of Birth</label>
          <input name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth" />
        </div>

        {/* Payment Info Section */}
        <div className="profile-section">
          <h2>Payment Information</h2>
          <label>Card Number</label>
          <input name="cardNumber" value={formData.cardNumber || ''} onChange={handleChange} placeholder="Card Number" />
          
          <label>Expiry</label>
          <input name="expiry" value={formData.expiry || ''} onChange={handleChange} placeholder="MM/YY" />
          
          <label>CVV</label>
          <input name="cvv" value={formData.cvv || ''} onChange={handleChange} placeholder="CVV" />
        </div>

        <button className="save-btn" onClick={handleSave}>Save</button>
        {message && <p className="save-message">{message}</p>}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  )}
</div>
