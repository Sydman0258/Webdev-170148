const { Rental, User, sequelize } = require('../model/Rentals');

const createRental = async (req, res) => {
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
};

const getAdminStats = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const totalProfit = await Rental.sum('price', { where: { status: 'completed' } });
    const activeRentals = await Rental.count({ where: { status: 'active' } });
    const totalRentals = await Rental.count();

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
};

module.exports = {
  createRental,
  getAdminStats
};
