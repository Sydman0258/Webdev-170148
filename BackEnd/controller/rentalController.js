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

const getAllRentals = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const rentals = await Rental.findAll({
      include: {
        model: Car,
        attributes: ['make', 'model', 'year', 'pricePerDay', 'fuelType', 'company', 'image']
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ error: 'Failed to fetch rentals' });
  }
};
const deleteRental = async (req, res) => {
  try {
    const rentalId = req.params.id;
    const user = await User.findByPk(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const rental = await Rental.findByPk(rentalId);
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    await rental.destroy();
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental:', error);
    res.status(500).json({ error: 'Failed to delete rental' });
  }
};

const updateRental = async (req, res) => {
  try {
    const rentalId = req.params.id;
    const user = await User.findByPk(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const rental = await Rental.findByPk(rentalId, {
      include: Car,
    });

    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    // Extract fields from req.body
    const {
      status,
      price,
      Car: carUpdates, // nested car updates object
    } = req.body;

    // Update rental fields if provided
    if (status !== undefined) rental.status = status;
    if (price !== undefined) rental.price = price;

    // Update car fields if provided
    if (carUpdates) {
      const car = await Car.findByPk(rental.carId);
      if (!car) {
        return res.status(404).json({ error: 'Associated car not found' });
      }

      // Update each car field if provided
      const carFields = ['make', 'model', 'year', 'pricePerDay', 'fuelType', 'company', 'image'];
      carFields.forEach(field => {
        if (carUpdates[field] !== undefined) {
          car[field] = carUpdates[field];
        }
      });

      await car.save();
    }

    await rental.save();

    // Reload rental with updated car info
    const updatedRental = await Rental.findByPk(rentalId, {
      include: {
        model: Car,
        attributes: ['make', 'model', 'year', 'pricePerDay', 'fuelType', 'company', 'image'],
      },
    });

    res.json(updatedRental);
  } catch (error) {
    console.error('Error updating rental:', error);
    res.status(500).json({ error: 'Failed to update rental' });
  }
};

const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const userId = req.user.id;

    const car = await Car.findByPk(carId);
    if (!car) return res.status(404).json({ error: "Car not found" });

    const pricePerDay = car.pricePerDay;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) {
      return res.status(400).json({ error: "Invalid rental dates" });
    }

    const totalPrice = pricePerDay * days;

const newBooking = await Rental.create({
  userId,
  carId,
  rentalDate: startDate,
  returnDate: endDate,
  price: totalPrice,
  status: 'active',
});


    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createRental,
  getAdminStats,
  getAllRentals,
  deleteRental,
  updateRental,
  createBooking,
};
