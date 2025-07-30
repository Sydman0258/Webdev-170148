// RentalRoute.test.js
const express = require('express');
const request = require('supertest');

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

const rentalController = require('../controller/rentalController');

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = { id: 1 };
  next();
});

app.post('/rentals', rentalController.createRental);

describe('Rental Route', () => {
  test('POST /rentals creates rental and returns 201 with car info and message', async () => {
    const response = await request(app).post('/rentals').send({
      make: 'Toyota',
      model: 'Corolla',
      year: '2022',
      pricePerDay: '50',
      fuelType: 'Petrol',
      company: 'Toyota',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('car');
    expect(response.body).toHaveProperty('message', 'Rental and car created successfully');
    // rental property is NOT expected here as per your controller
  });
});
