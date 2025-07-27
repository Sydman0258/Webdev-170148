import React, { useEffect, useState } from 'react';

const ManageRental = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token'); // Assuming JWT stored here

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/all-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await res.json();
        setBookings(data.bookings);
      } catch (err) {
        setError(err.message || 'Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [API_BASE, token]);

  if (loading) return <p>Loading your rentals...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (!bookings.length) return <p>You have no rentals or bookings currently.</p>;

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '1rem' }}>
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        &larr; Back
      </button>

      <h2>Your Rented Cars</h2>
      {bookings.map((booking) => {
        const car = booking.Car;

        if (!car) {
          return (
            <div
              key={booking.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#f9f9f9',
                color: '#555',
              }}
            >
              <p>Car details not available for this booking (ID: {booking.id})</p>
            </div>
          );
        }

        return (
          <div
            key={booking.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {car.image && (
              <img
                src={`${API_BASE}/uploads/${car.image}`}
                alt={`${car.make} ${car.model}`}
                style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: '6px' }}
              />
            )}
            <div>
{booking.User && (
  <p>
    User: {booking.User.firstName} {booking.User.surname}
  </p>
)}

              <h3>
                {car.make} {car.model} ({car.year})
              </h3>
              <p>Fuel Type: {car.fuelType || 'N/A'}</p>
              <p>Company: {car.company || 'N/A'}</p>
              <p>
                Rental Dates:{' '}
                {booking.rentalDate
                  ? new Date(booking.rentalDate).toLocaleDateString()
                  : ''}{' '}
                -{' '}
                {booking.returnDate
                  ? new Date(booking.returnDate).toLocaleDateString()
                  : booking.rentalDate
                  ? 'Ongoing'
                  : ''}
              </p>
              <p>
                Status: <strong>{booking.status}</strong>
              </p>
              <p>Price Paid: ${booking.price.toFixed(2)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManageRental;
