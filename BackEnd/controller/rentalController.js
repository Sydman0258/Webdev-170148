const Rental = require('../model/Rentals');    // Or '../models/Rental' based on your folder name
const User = require('../model/User');        // Adjust path as needed
const Car = require('../model/Car');          // You already import Car somewhere, make sure path is consistent
const { sequelize } = require('../Database/db');




const createRental = async (req, res) => {
  try {
    const userId = req.user.id;

    // Extract all needed fields from req.body (multipart/form-data parsed by multer)
    const {
      make,
      model,
      year,
      pricePerDay,
      fuelType,
      company,
    } = req.body;

    // Basic validation
    if (!make || !model || !year || !pricePerDay ) {
      return res.status(400).json({ error: 'Missing required car or rental fields' });
    }

    // Get uploaded image filename from multer
    const imageFilename = req.file ? req.file.filename : null;

    // Create new Car entry
 const existingCar = await Car.findOne({
  where: { make, model, year }
});
if (existingCar) {
  // Use existing car instead of creating a new one
  car = existingCar;
} else {
  // Create new car
  car = await Car.create({
    make,
    model,
    year: parseInt(year, 10),
    pricePerDay: parseFloat(pricePerDay),
    fuelType: fuelType || null,
    company: company || null,
    image: req.file ? req.file.filename : null,
  });
}

    // Create Rental linked to this car and user
    const rental = await Rental.create({
      userId,
      carId: car.id,
      price: parseFloat(pricePerDay), // Assuming price is the same as pricePerDay for simplicity
      rentalDate: new Date(),
      status: 'active',
    });

    res.status(201).json({
      message: 'Rental and car created successfully',
      rental,
      car,
    });
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
  getAdminStats,
};
