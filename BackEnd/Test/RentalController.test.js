// RentalController.test.js
const rentalController = require('../controller/rentalController');

// Mock Rental model
jest.mock('../model/Rentals', () => ({
  create: jest.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    carId: 2,
    price: 50,
    rentalDate: new Date(),
    returnDate: new Date(),
    status: 'active',
  }),
  sum: jest.fn().mockResolvedValue(1000),
  count: jest.fn()
    .mockResolvedValueOnce(5)   // activeRentals count
    .mockResolvedValueOnce(20)  // totalRentals count
    .mockResolvedValue(5),      // fallback
  findAll: jest.fn().mockResolvedValue([{ carId: 2 }, { carId: 3 }]),
  update: jest.fn().mockResolvedValue([1]),
  findOne: jest.fn().mockResolvedValue(null),
  findByPk: jest.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    destroy: jest.fn().mockResolvedValue(true),
  }),
}));

// Mock Car model
jest.mock('../model/Car', () => ({
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({
    id: 2,
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    pricePerDay: 50,
    fuelType: 'Petrol',
    company: 'Toyota',
    image: 'car.jpg',
  }),
  findByPk: jest.fn().mockResolvedValue({
    id: 2,
    pricePerDay: 50,
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    fuelType: 'Petrol',
    company: 'Toyota',
    image: 'car.jpg',
    update: jest.fn().mockResolvedValue(true),
    destroy: jest.fn().mockResolvedValue(true),
  }),
  findAll: jest.fn().mockResolvedValue([
    {
      id: 2,
      make: 'Toyota',
      model: 'Corolla',
      year: 2022,
      pricePerDay: 50,
      fuelType: 'Petrol',
      company: 'Toyota',
      image: 'car.jpg',
    },
  ]),
  count: jest.fn().mockResolvedValue(10),
}));

// Mock User model
jest.mock('../model/User', () => ({
  findByPk: jest.fn().mockResolvedValue({ id: 1, isAdmin: true }),
}));

// Mock Sequelize query for profitByMonth
jest.mock('../Database/db', () => ({
  sequelize: {
    query: jest.fn().mockResolvedValue([
      [
        { month: '2023-01', total_profit: 500 },
        { month: '2023-02', total_profit: 300 },
      ],
    ]),
  },
}));

describe('Rental Controller', () => {
  const mockReq = {
    body: {
      make: 'Toyota',
      model: 'Corolla',
      year: '2022',
      pricePerDay: '50',
      fuelType: 'Petrol',
      company: 'Toyota',
    },
    user: { id: 1 },
    file: { filename: 'car.jpg' },
    params: { id: '1' },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createRental should respond with 201 and rental info', async () => {
    await rentalController.createRental(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Rental and car created successfully',
      car: expect.objectContaining({
        id: 2,
        make: 'Toyota',
        model: 'Corolla',
        year: 2022,
        pricePerDay: 50,
        fuelType: 'Petrol',
        company: 'Toyota',
        image: 'car.jpg',
      }),
    });
  });

  test('getAdminStats returns stats for admin', async () => {
    await rentalController.getAdminStats(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      totalProfit: expect.any(Number),
      activeRentals: expect.any(Number),
      totalRentals: expect.any(Number),
      profitByMonth: expect.any(Array),
      totalCars: expect.any(Number),
      bookedCars: expect.any(Number),
      availableCars: expect.any(Number),
    }));
  });

  test('getAllRentals returns rentals for admin', async () => {
    const rentalsMock = [{ id: 1, car: { make: 'Toyota' } }];
    const Rental = require('../model/Rentals');
    Rental.findAll.mockResolvedValueOnce(rentalsMock);

    await rentalController.getAllRentals(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(rentalsMock);
  });

  test('createBooking creates a booking and returns 201', async () => {
    const req = {
      body: { carId: 2, startDate: '2023-07-01', endDate: '2023-07-03' },
      user: { id: 1 },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await rentalController.createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Booking successful',
      booking: expect.objectContaining({
        userId: 1,
        carId: 2,
        status: 'active',
      }),
    }));
  });

  test('getUserBookings returns bookings', async () => {
    await rentalController.getUserBookings(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      bookings: expect.any(Array),
    }));
  });

  test('deleteBooking deletes booking if owned by user', async () => {
    await rentalController.deleteBooking(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Booking deleted successfully' });
  });

  test('getAvailableCars returns list of cars', async () => {
    await rentalController.getAvailableCars(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('deleteCar deletes car for admin', async () => {
    await rentalController.deleteCar(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Car deleted successfully' });
  });

  test('getAllCars returns all cars', async () => {
    await rentalController.getAllCars(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
  });

  test('getAllBookings returns bookings for admin', async () => {
    await rentalController.getAllBookings(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      bookings: expect.any(Array),
    }));
  });

  test('updateCar updates car for admin', async () => {
    await rentalController.updateCar(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Car updated successfully',
      car: expect.any(Object),
    }));
  });
});
