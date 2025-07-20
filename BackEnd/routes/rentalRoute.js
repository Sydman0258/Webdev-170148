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
} = require('../controller/rentalController');

const Car = require('../model/Car');
const Rental = require('../model/Rentals'); // Import the Rental model to check booking status

// ✅ Route: Create rental (with image upload)
router.post('/rent', verifyToken, upload.single('image'), createRental);

// ✅ Route: Create booking (used from BookingPage.jsx)
// filepath: c:\Users\Victus\OneDrive\Desktop\Final\Webdev-170148\BackEnd\routes\rentalRoute.js
router.post('/bookings', verifyToken, (req, res, next) => {
  console.log('POST /api/bookings hit');
  next();
}, createBooking);
// ✅ Route: Get admin statistics (only if user is admin)
router.get('/admin/stats', verifyToken, getAdminStats);

router.get('/my-bookings', verifyToken, getUserBookings);
// ✅ Route: Get all rentals (admin only)
router.get('/admin/rentals', verifyToken, getAllRentals);

// ✅ Route: Delete a rental (admin only)
router.delete('/admin/rent/:id', verifyToken, deleteRental);

// ✅ Route: Update rental (admin only)
router.patch('/admin/rent/:id', verifyToken, updateRental);

router.delete('/bookings/:id', verifyToken, deleteBooking);


// ✅ Route: Get car details by ID
router.get('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.json(car);
  } catch (error) {
    console.error('Error fetching car by id:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/cars', getAvailableCars);

// ✅ Route: Get all available cars (excluding booked ones)
router.get('/cars', async (req, res) => {
  try {
    const allCars = await Car.findAll();
    res.json(allCars);
  } catch (error) {
    console.error('Failed to fetch cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});




module.exports = router;
