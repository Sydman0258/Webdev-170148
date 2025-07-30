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

    

    // Return success response
    res.status(201).json({
      message: 'Rental and car created successfully',
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
const deleteCar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const carId = req.params.id;

    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Optional: prevent deletion if the car has active rentals
    const activeRental = await Rental.findOne({ where: { carId, status: 'active' } });
    if (activeRental) {
      return res.status(400).json({ error: "Car is currently rented and cannot be deleted" });
    }

    await car.destroy();
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Failed to delete car:", error);
    res.status(500).json({ error: "Server error while deleting car" });
  }
};

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      order: [['createdAt', 'DESC']], // optional, latest first
    });
    res.json(cars);
  } catch (error) {
    console.error('Failed to fetch all cars:', error);
    res.status(500).json({ error: 'Server error fetching all cars' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const bookings = await Rental.findAll({
      include: [
        { model: Car },
{ model: User, attributes: ['firstName', 'surname', 'email'] }
      ],
      order: [['rentalDate', 'DESC']],
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Admin fetch bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};
const updateCar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const carId = req.params.id;
    const {
      make,
      model,
      year,
      pricePerDay,
      fuelType,
      company
    } = req.body;

    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Update only provided fields
    await car.update({
      make: make ?? car.make,
      model: model ?? car.model,
      year: year ?? car.year,
      pricePerDay: pricePerDay ?? car.pricePerDay,
      fuelType: fuelType ?? car.fuelType,
      company: company ?? car.company,
    });

    res.json({ message: "Car updated successfully", car });
  } catch (error) {
    console.error("Failed to update car:", error);
    res.status(500).json({ error: "Server error while updating car" });
  }
};


// Export all controller functions
module.exports = {
  createRental, // Adds car to be rentable
  getAdminStats, // Fetches admin Stats
  getAllRentals, // Fetches all rentals for admim
  createBooking, // Creates a booking for user
  getUserBookings, // Fetches all the booking of the current user
  deleteBooking, // Delets user booking
  getAvailableCars, // Displays only "available" cars i.e inactive
  deleteCar, // Deletes a car 
  getAllCars, // gets all car
  getAllBookings, // gets all booking for admin
  updateCar,
};
