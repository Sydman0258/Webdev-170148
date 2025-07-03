const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // multer middleware

const {
  createRental,
  getAdminStats,
} = require('../controller/rentalController');

const Car = require('../model/Car'); // Import Car model

// Rental creation with image upload — 'image' is the form field name
router.post('/rent', verifyToken, upload.single('image'), createRental);

router.get('/admin/stats', verifyToken, getAdminStats);

// Add this route to fetch all cars
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
