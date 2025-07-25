const Rental = require('../model/Rentals'); // Rental model
const User = require('../model/User'); // User model
const Car = require('../model/Car'); // Car model
const { sequelize } = require('../Database/db'); // Sequelize instance
const { Op } = require('sequelize'); // Sequelize operators

// Create a rental (used when admin adds a car and makes it rentable immediately)
const createRental = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT

    const {
      make,
      model,
      year,
      pricePerDay,
      fuelType,
      company,
    } = req.body; // Destructure car/rental data from request body

    // Check required fields
    if (!make || !model || !year || !pricePerDay) {
      return res.status(400).json({ error: 'Missing required car or rental fields' });
    }

    // Extract uploaded image filename (if available from multer)
    const imageFilename = req.file ? req.file.filename : null;

    // Check if car already exists by make/model/year
    const existingCar = await Car.findOne({
      where: { make, model, year }
    });

    // If exists, reuse it; otherwise create a new car entry
    let car;
    if (existingCar) {
      car = existingCar;
    } else {
      car = await Car.create({
        make,
        model,
        year: parseInt(year, 10),
        pricePerDay: parseFloat(pricePerDay),
        fuelType: fuelType || null,
        company: company || null,
        image: imageFilename,
      });
    }

    // Create a rental linked to user and car
    const rental = await Rental.create({
      userId,
      carId: car.id,
      price: parseFloat(pricePerDay), // Assuming price is just per day for now
      rentalDate: new Date(),
      status: 'inactive', // Defaults to inactive
    });

    // Return success response
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

// Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Auto-update past rentals to "completed" before calculating stats
    await completePastRentals();

    const totalProfit = await Rental.sum('price', { where: { status: 'completed' } });
    const activeRentals = await Rental.count({ where: { status: 'active' } });
    const totalRentals = await Rental.count();

    const totalCars = await Car.count();

    // Get all currently booked (active) car IDs
    const bookedCarIds = await Rental.findAll({
      where: { status: 'active' },
      attributes: ['carId'],
      group: ['carId'],
    });

    const bookedCarCount = bookedCarIds.length;
    const availableCars = totalCars - bookedCarCount;

    // Profit grouped by month using raw SQL
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
      totalCars,
      bookedCars: bookedCarCount,
      availableCars,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};

// Get all rentals for admin panel
const getAllRentals = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Include car details in the rental response
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

// Delete a rental (admin only)
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

    await rental.destroy(); // Delete from DB
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental:', error);
    res.status(500).json({ error: 'Failed to delete rental' });
  }
};

// Update rental and optionally the associated car
const updateRental = async (req, res) => {
  try {
    const rentalId = req.params.id;
    const user = await User.findByPk(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const rental = await Rental.findByPk(rentalId, { include: Car });
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    const { status, price, Car: carUpdates } = req.body;

    // Update rental status/price if provided
    if (status !== undefined) rental.status = status;
    if (price !== undefined) rental.price = price;

    // Update linked car details if provided
    if (carUpdates) {
      const car = await Car.findByPk(rental.carId);
      if (!car) return res.status(404).json({ error: 'Associated car not found' });

      const fields = ['make', 'model', 'year', 'pricePerDay', 'fuelType', 'company', 'image'];
      fields.forEach(field => {
        if (carUpdates[field] !== undefined) car[field] = carUpdates[field];
      });

      await car.save(); // Save updated car
    }

    await rental.save(); // Save rental changes

    // Reload with updated car info
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

// User creates a booking by selecting a car and date range
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

// Fetch all bookings of the current user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Rental.findAll({
      where: { userId },
      include: {
        model: Car,
        attributes: ['make', 'model', 'year', 'pricePerDay', 'fuelType', 'company', 'image'],
      },
      order: [['rentalDate', 'DESC']],
    });

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Allow user to cancel/delete their booking
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Rental.findByPk(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.userId !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this booking" });
    }

    await booking.destroy();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

// Fetch cars that are not currently rented (available)
const getAvailableCars = async (req, res) => {
  try {
    const activeRentals = await Rental.findAll({
      where: { status: 'active' },
      attributes: ['carId']
    });

    const bookedCarIds = activeRentals.map(rental => rental.carId);

    const availableCars = await Car.findAll({
      where: {
        id: bookedCarIds.length > 0 ? { [Op.notIn]: bookedCarIds } : { [Op.ne]: null }
      }
    });

    res.json(availableCars);
  } catch (error) {
    console.error('Failed to fetch available cars:', error);
    res.status(500).json({ error: 'Server error fetching available cars' });
  }
};

// Automatically complete rentals with returnDate in the past
const completePastRentals = async () => {
  const now = new Date();

  try {
    const [updatedCount] = await Rental.update(
      { status: 'completed' },
      {
        where: {
          status: 'active',
          returnDate: { [Op.lt]: now },
        },
      }
    );

    console.log(`✅ Auto-completed ${updatedCount} rentals.`);
  } catch (error) {
    console.error('❌ Error auto-completing rentals:', error);
  }
};

// Export all controller functions
module.exports = {
  createRental,
  getAdminStats,
  getAllRentals,
  deleteRental,
  updateRental,
  createBooking,
  getUserBookings,
  deleteBooking,
  getAvailableCars,
};
