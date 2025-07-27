import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/ManageRental.css"; // Your existing styles

const AllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCar, setEditCar] = useState(null); // Car to edit
  const [editForm, setEditForm] = useState({
    make: "",
    model: "",
    year: "",
    fuelType: "",
    pricePerDay: "",
    company: "",
    image: "",
  });

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cars/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch cars");

        const data = await res.json();
        setCars(data);
      } catch (err) {
        setError(err.message || "Error fetching cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [API_BASE, token]);

  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/car/${carId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete car");

      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    } catch (err) {
      alert(err.message || "Error deleting car");
    }
  };

  const openEditModal = (car) => {
    setEditCar(car);
    setEditForm({
      make: car.make || "",
      model: car.model || "",
      year: car.year || "",
      fuelType: car.fuelType || "",
      pricePerDay: car.pricePerDay || "",
      company: car.company || "",
      image: car.image || "",
    });
  };

  const closeEditModal = () => {
    setEditCar(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editCar) return;

    try {
      const res = await fetch(`${API_BASE}/api/car/${editCar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update car");

      const updatedCar = await res.json();

      setCars((prevCars) =>
        prevCars.map((car) => (car.id === updatedCar.id ? updatedCar : car))
      );

      closeEditModal();
    } catch (err) {
      alert(err.message || "Error updating car");
    }
  };

  if (loading) return <p className="loading-text">Loading cars...</p>;
  if (error)
    return (
      <p className="loading-text" style={{ color: "red" }}>
        {error}
      </p>
    );
  if (!cars.length) return <p className="loading-text">No available cars found.</p>;

  return (
    <div className="manage-rental-container">
      <button
        className="go-back-btn"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "1rem", cursor: "pointer" }}
      >
        &larr; Go Back
      </button>

      <h2 className="title">All Available Cars</h2>

      <div className="cards-wrapper">
        {cars.map((car) => (
          <div key={car.id} className="rental-card">
            <img
              src={
                car.image
                  ? `${API_BASE}/uploads/${car.image}`
                  : "https://via.placeholder.com/400x200?text=No+Image"
              }
              alt={`${car.make} ${car.model}`}
              className="rental-car-img"
              loading="lazy"
            />
            <div className="car-details">
              <h3>
                {car.make} {car.model}
              </h3>
              <p>
                <strong>Year:</strong> {car.year || "N/A"}
              </p>
              <p>
                <strong>Fuel Type:</strong> {car.fuelType || "N/A"}
              </p>
              <p>
                <strong>Price/Day:</strong> ${car.pricePerDay ?? "N/A"}
              </p>
            </div>

            {/* Buttons side by side */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button
                className="edit-btn"
                onClick={() => openEditModal(car)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  flex: 1,
                }}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(car.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  flex: 1,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editCar && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeEditModal}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "400px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Car Details</h3>

            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                name="make"
                placeholder="Make"
                value={editForm.make}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="model"
                placeholder="Model"
                value={editForm.model}
                onChange={handleEditChange}
                required
              />
              <input
                type="number"
                name="year"
                placeholder="Year"
                value={editForm.year}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="fuelType"
                placeholder="Fuel Type"
                value={editForm.fuelType}
                onChange={handleEditChange}
              />
              <input
                type="number"
                step="0.01"
                name="pricePerDay"
                placeholder="Price Per Day"
                value={editForm.pricePerDay}
                onChange={handleEditChange}
                required
              />
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={editForm.company}
                onChange={handleEditChange}
              />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  style={{
                    backgroundColor: "#ccc",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCars;
