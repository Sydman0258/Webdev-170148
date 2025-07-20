import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/ManageRental.css';

const ManageRental = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRental, setEditingRental] = useState(null);
  const [editForm, setEditForm] = useState({
    make: '',
    model: '',
    year: '',
    fuelType: '',
    pricePerDay: '',
    rentalPrice: '',
  });
  const [deleteRentalId, setDeleteRentalId] = useState(null);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/admin/rentals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch rentals');
    const data = await res.json();
    // Force remove duplicates by ID (just for debugging)
    const uniqueRentals = Array.from(new Map(data.map(r => [r.id, r])).values());
    setRentals(uniqueRentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
  } finally {
    setLoading(false);
  }
};


  const openEditModal = (rental) => {
    setEditingRental(rental);
    setEditForm({
      make: rental.Car?.make || '',
      model: rental.Car?.model || '',
      year: rental.Car?.year || '',
      fuelType: rental.Car?.fuelType || '',
      pricePerDay: rental.Car?.pricePerDay || '',
      rentalPrice: rental.price || '',
    });
  };

  const closeEditModal = () => {
    setEditingRental(null);
    setEditForm({
      make: '',
      model: '',
      year: '',
      fuelType: '',
      pricePerDay: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      const payload = {
        status: editForm.status,
        price: editForm.rentalPrice,
        Car: {
          make: editForm.make,
          model: editForm.model,
          year: editForm.year,
          fuelType: editForm.fuelType,
          pricePerDay: editForm.pricePerDay,
        },
      };

      const res = await fetch(`${API_BASE}/api/admin/rent/${editingRental.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update rental');

      const updatedRental = await res.json();

      setRentals((prev) =>
        prev.map((rental) => (rental.id === updatedRental.id ? updatedRental : rental))
      );

      closeEditModal();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const openDeleteModal = (rentalId) => {
    setDeleteRentalId(rentalId);
  };

  const closeDeleteModal = () => {
    setDeleteRentalId(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/rent/${deleteRentalId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete rental');
      setRentals((prev) => prev.filter((rental) => rental.id !== deleteRentalId));
      closeDeleteModal();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (loading) return <p className="loading-text">Loading rentals...</p>;
  if (!rentals.length) return <p className="loading-text">No rentals found.</p>;

  return (
    <div className="manage-rental-container">
      {/* Go Back Button */}
      <button
        className="go-back-btn"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1rem', cursor: 'pointer' }}
      >
        &larr; Go Back
      </button>

      <h2 className="title">Manage Rentals</h2>

      <div className="cards-wrapper">
        {rentals.map((rental) => (
          <div key={rental.id} className="rental-card">
            <img
              src={
                rental.Car && rental.Car.image
                  ? `${API_BASE}/uploads/${rental.Car.image}`
                  : 'https://via.placeholder.com/400x200?text=No+Image'
              }
              alt={`${rental.Car?.make} ${rental.Car?.model}`}
              className="rental-car-img"
            />
            <div className="car-details">
              <h3>{rental.Car?.make} {rental.Car?.model}</h3>
              <p><strong>Year:</strong> {rental.Car?.year || 'N/A'}</p>
              <p><strong>Fuel Type:</strong> {rental.Car?.fuelType || 'N/A'}</p>
              <p><strong>Price/Day:</strong> ${rental.Car?.pricePerDay || 'N/A'}</p>
            </div>
            <div className="btn-group">
              <button className="btn edit-btn" onClick={() => openEditModal(rental)}>Edit</button>
              <button className="btn delete-btn" onClick={() => openDeleteModal(rental.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingRental && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Edit Rental & Car Details</h3>

            {/* Form Group for each field */}
            <div className="form-group">
              <label htmlFor="make">Make:</label>
              <input
                id="make"
                type="text"
                name="make"
                value={editForm.make}
                onChange={handleInputChange}
                placeholder="Car Make"
              />
            </div>

            <div className="form-group">
              <label htmlFor="model">Model:</label>
              <input
                id="model"
                type="text"
                name="model"
                value={editForm.model}
                onChange={handleInputChange}
                placeholder="Car Model"
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Year:</label>
              <input
                id="year"
                type="number"
                name="year"
                value={editForm.year}
                onChange={handleInputChange}
                placeholder="Year"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuelType">Fuel Type:</label>
              <input
                id="fuelType"
                type="text"
                name="fuelType"
                value={editForm.fuelType}
                onChange={handleInputChange}
                placeholder="Fuel Type"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pricePerDay">Price Per Day:</label>
              <input
                id="pricePerDay"
                type="number"
                name="pricePerDay"
                value={editForm.pricePerDay}
                onChange={handleInputChange}
                placeholder="Price Per Day"
              />
            </div>

          


            <div className="modal-btn-group">
              <button className="btn save-btn" onClick={saveEdit}>Save</button>
              <button className="btn cancel-btn" onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteRentalId && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this rental?</p>
            <div className="modal-btn-group">
              <button className="btn delete-btn" onClick={handleDelete}>Yes, Delete</button>
              <button className="btn cancel-btn" onClick={closeDeleteModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRental;
