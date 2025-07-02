import React, { useEffect, useState } from 'react';

const AddRental = () => {
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState('');
  const [price, setPrice] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [message, setMessage] = useState('');
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  // Fetch available cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cars`);
        const data = await res.json();
        setCars(data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
        setMessage('Could not load cars');
      }
    };

    fetchCars();
  }, [API_BASE]);

  // Handle rental submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carId || !price) {
      setMessage('Please fill in required fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/rent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carId, price, returnDate }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Rental created successfully!');
        setCarId('');
        setPrice('');
        setReturnDate('');
      } else {
        setMessage(data.error || 'Rental failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Server error occurred');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add a Rental</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="carId">Select Car:</label>
        <select
          id="carId"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
          required
        >
          <option value="">-- Choose a car --</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.make} {car.model} ({car.year})
            </option>
          ))}
        </select>

        <br /><br />

        <label htmlFor="price">Rental Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <br /><br />

        <label htmlFor="returnDate">Return Date (optional):</label>
        <input
          type="date"
          id="returnDate"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />

        <br /><br />

        <button type="submit">Add Rental</button>
      </form>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default AddRental;
