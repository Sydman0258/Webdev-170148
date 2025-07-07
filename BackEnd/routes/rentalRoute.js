const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const {
  createRental,
  getAdminStats,
  getAllRentals,
  deleteRental,
} = require('../controller/rentalController');

const Car = require('../model/Car');

// Rental creation with image upload
router.post('/rent', verifyToken, upload.single('image'), createRental);

// Get admin stats
router.get('/admin/stats', verifyToken, getAdminStats);

// Get all rentals (admin only)
router.get('/admin/rentals', verifyToken, getAllRentals);
// Delete rental by id (admin only)
router.delete('/admin/rent/:id', verifyToken, deleteRental);

// Fetch car by id
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

router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.json(cars);
  } catch (error) {
    console.error('Failed to fetch cars:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});



module.exports = router;
