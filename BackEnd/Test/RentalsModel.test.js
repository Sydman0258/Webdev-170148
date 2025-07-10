const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const Rental = dbMock.define('Rental', {
  id: 1,
  rentalDate: new Date(),
  returnDate: null,
  price: 150.0,
  status: 'active',
  userId: 1,
  carId: 2,
});

describe('Rental Model', () => {
  test('should create a rental with correct fields', async () => {
    const rental = await Rental.create();

    expect(rental.id).toBe(1);
    expect(rental.status).toBe('active');
    expect(rental.userId).toBe(1);
    expect(rental.carId).toBe(2);
    expect(rental.price).toBe(150.0);
  });

  test('should update status to completed', async () => {
    const rental = await Rental.create();
    rental.status = 'completed';
    await rental.save();

    expect(rental.status).toBe('completed');
  });
});
