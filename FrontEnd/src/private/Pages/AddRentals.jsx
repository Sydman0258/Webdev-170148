import React, { useState } from 'react';
import '../Styles/AddRental.css';

const AddRental = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [company, setCompany] = useState('');
  const [price, setPrice] = useState(''); // total rental price
  const [returnDate, setReturnDate] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!make || !model || !year || !pricePerDay || !image) {
      setMessage('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    formData.append('year', year);
    formData.append('pricePerDay', pricePerDay);
    formData.append('fuelType', fuelType);
    formData.append('company', company);
    formData.append('image', image);

    try {
      const res = await fetch(`${API_BASE}/api/rent`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Let browser set Content-Type for multipart/form-data
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Rental created successfully!');
        // Clear form fields
        setMake('');
        setModel('');
        setYear('');
        setPricePerDay('');
        setFuelType('');
        setCompany('');
        setPrice('');
        setImage(null);
      } else {
        setMessage(data.error || 'Rental creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server error occurred');
    }
  };

  return (
    <div className="add-rental-container">
      <div className="add-rental-form-wrapper">
        <h2 className="add-rental-title">Add a Rental</h2>

        <form
          className="add-rental-form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <label htmlFor="make">Car Company (Make):</label>
          <input
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
            placeholder="e.g. Tesla"
          />

          <label htmlFor="model">Car Model:</label>
          <input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            placeholder="e.g. Model S"
          />

          <label htmlFor="year">Year:</label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            placeholder="e.g. 2023"
          />

          <label htmlFor="pricePerDay">Price Per Day ($):</label>
          <input
            id="pricePerDay"
            type="number"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            required
            placeholder="e.g. 120"
          />

          <label htmlFor="fuelType">Fuel Type:</label>
          <input
            id="fuelType"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            placeholder="e.g. Electric, Petrol"
          />

          <label htmlFor="company">Car Company (Optional):</label>
          <input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Optional"
          />

       
      

          <label htmlFor="image">Upload Car Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          <button type="submit">Add Rental</button>
        </form>

        {message && (
          <p
            className={`add-rental-message ${
              message.startsWith('✅') ? 'success' : 'error'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddRental;
