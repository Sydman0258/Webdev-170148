// routes/rental.js
const express = require('express');
const router = express.Router();
const { Rental, User, Car, sequelize } = require('../models'); // adjust paths/models as needed
const verifyToken = require('./verifyToken'); // your JWT middleware

// POST /api/rent - Create a new rental (user rents a car)
router.post('/api/rent', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId, price, returnDate } = req.body;

    if (!carId || !price) {
      return res.status(400).json({ error: 'carId and price are required' });
    }

    const rental = await Rental.create({
      userId,
      carId,
      price,
      returnDate: returnDate || null,
      rentalDate: new Date(),
      status: 'active',
    });

    res.status(201).json({ message: 'Rental created successfully', rental });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ error: 'Failed to create rental' });
  }
});

// GET /api/admin/stats - Get aggregated stats for admin dashboard
router.get('/api/admin/stats', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Total profit (sum of price of completed rentals)
    const totalProfit = await Rental.sum('price', { where: { status: 'completed' } });

    // Total active rentals count
    const activeRentals = await Rental.count({ where: { status: 'active' } });

    // Total rentals count
    const totalRentals = await Rental.count();

    // Profit by month - raw SQL (Postgres example)
    const [profitByMonth] = await sequelize.query(`
      SELECT 
        TO_CHAR("rentalDate", 'YYYY-MM') AS month,
        SUM(price) AS total_profit
      FROM "Rentals"
      WHERE status = 'completed'
      GROUP BY month
      ORDER BY month;
    `);

    res.json({
      totalProfit: totalProfit || 0,
      activeRentals,
      totalRentals,
      profitByMonth,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
