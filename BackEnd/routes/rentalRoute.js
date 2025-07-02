const express = require('express');
const router = express.Router();
const{ verifyToken} = require('../middleware/authMiddleware');
const {
  createRental,
  getAdminStats
} = require('../controller/rentalController');

// Rental creation
router.post('/rent', verifyToken, createRental);

// Admin dashboard stats
router.get('/admin/stats', verifyToken, getAdminStats);

module.exports = router;
