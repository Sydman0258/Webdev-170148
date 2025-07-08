const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { Op } = require('sequelize'); // Used for NOT IN filtering

const {
  createRental,
  getAdminStats,
  getAllRentals,
  deleteRental,
  updateRental,
  createBooking,
} = require('../controller/rentalController');

const Car = require('../model/Car');
const Rental = require('../model/Rentals'); // Import the Rental model to check booking status

// ✅ Route: Create rental (with image upload)
router.post('/rent', verifyToken, upload.single('image'), createRental);

// ✅ Route: Create booking (used from BookingPage.jsx)
router.post('/bookings', verifyToken, createBooking);

// ✅ Route: Get admin statistics (only if user is admin)
router.get('/admin/stats', verifyToken, getAdminStats);

// ✅ Route: Get all rentals (admin only)
router.get('/admin/rentals', verifyToken, getAllRentals);

// ✅ Route: Delete a rental (admin only)
router.delete('/admin/rent/:id', verifyToken, deleteRental);

// ✅ Route: Update rental (admin only)
router.patch('/admin/rent/:id', verifyToken, updateRental);

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

// ✅ Route: Get all available cars (excluding booked ones)
router.get('/cars', async (req, res) => {
  try {
    // 🔍 Step 1: Find carIds that are already booked (rental is active)
    const activeRentals = await Rental.findAll({
      where: { status: 'active' },
      attributes: ['carId'] // We only need carId field
    });

    // 📋 Extract an array of car IDs from those active rentals
    const bookedCarIds = activeRentals.map(rental => rental.carId);

    // 🔍 Step 2: Fetch only those cars that are NOT booked
    const availableCars = await Car.findAll({
      where: {
        id: {
          [Op.notIn]: bookedCarIds // Exclude booked car IDs
        }
      }
    });

    // ✅ Return the available cars only
    res.json(availableCars);
  } catch (error) {
    console.error('Failed to fetch available cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

module.exports = router;
