import React, { useEffect, useState } from 'react';
import '../Styles/ManageRental.css';

const ManageRental = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRental, setEditingRental] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [deleteRentalId, setDeleteRentalId] = useState(null);
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

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
      setRentals(data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (rental) => {
    setEditingRental(rental);
    setNewStatus(rental.status);
  };

  const closeEditModal = () => {
    setEditingRental(null);
    setNewStatus('');
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/rent/${editingRental.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
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
              <p><strong>Rental Price:</strong> ${rental.price}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${rental.status.toLowerCase()}`}>{rental.status}</span></p>
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
            <h3>Edit Rental Status</h3>
            <p>
              Car: {editingRental.Car?.make} {editingRental.Car?.model}
            </p>
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="status-input"
              placeholder="Enter new status"
            />
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
