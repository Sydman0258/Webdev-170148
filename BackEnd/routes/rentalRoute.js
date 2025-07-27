const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { Op } = require('sequelize');

const {
  createRental,
  getAdminStats,
  getAllRentals,
  deleteRental,
  updateRental,
  createBooking,
  getUserBookings,
  deleteBooking,
  getAvailableCars,
  deleteCar,
  getAllCars,
  getAllBookings,
} = require('../controller/rentalController');

const Car = require('../model/Car');
const Rental = require('../model/Rentals'); // For checking booking status

// Create rental (with image upload)
router.post('/rent', verifyToken, upload.single('image'), createRental);

// Create booking
router.post('/bookings', verifyToken, (req, res, next) => {
  console.log('POST /api/bookings hit');
  next();
}, createBooking);

// Admin stats
router.get('/admin/stats', verifyToken, getAdminStats);

// User bookings
router.get('/my-bookings', verifyToken, getUserBookings);
// routes/rentalRoutes.js
router.get('/all-bookings', verifyToken, getAllBookings);


// Admin rentals
router.get('/admin/rentals', verifyToken, getAllRentals);

// Delete rental (admin)
router.delete('/admin/rent/:id', verifyToken, deleteRental);

// Update rental (admin)
router.patch('/admin/rent/:id', verifyToken, updateRental);

// Delete booking
router.delete('/bookings/:id', verifyToken, deleteBooking);

// Delete car
router.delete('/car/:id', verifyToken, deleteCar);

// Get all cars (all)
router.get('/cars/all', getAllCars);

// Get available cars - explicitly separate route
router.get('/cars/available', getAvailableCars);

// Get car details by ID (with validation)
router.get('/cars/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid car id' });
  }

  try {
    const car = await Car.findByPk(id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (error) {
    console.error('Error fetching car by id:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
