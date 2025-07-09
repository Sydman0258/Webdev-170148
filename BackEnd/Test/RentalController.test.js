// RentalController.test.js
const rentalController = require('../controller/rentalController');

jest.mock('../model/Rentals', () => ({
  create: jest.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    carId: 2,
    price: 50,
    rentalDate: new Date(),
    status: 'active',
  }),
}));

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
}));

jest.mock('../model/User', () => ({
  findByPk: jest.fn().mockResolvedValue({ id: 1, isAdmin: true }),
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
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  test('createRental should respond with 201 and rental info', async () => {
    await rentalController.createRental(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Rental and car created successfully',
        rental: expect.any(Object),
        car: expect.any(Object),
      })
    );
  });
});
