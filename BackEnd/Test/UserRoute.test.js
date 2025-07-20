// Test/UserRoute.test.js
const express = require('express');
const request = require('supertest'); // For HTTP testing
const userRouter = require('../routes/userRoute');

jest.mock('../controller/userController', () => ({
  register: jest.fn((req, res) => res.status(201).json({ message: 'Registered' })),
  login: jest.fn((req, res) => res.json({ message: 'Logged in', token: 'fake-token' })),
  getProfile: jest.fn((req, res) => res.json({ user: { id: 1, username: 'testuser' } })),
  updateProfile: jest.fn((req, res) => res.json({ message: 'Profile updated' })),
  deleteAccount: jest.fn((req, res) => res.json({ message: 'Account deleted' })),
}));

jest.mock('../middleware/authMiddleware', () => ({
  verifyToken: (req, res, next) => next(), // mock middleware just calls next()
}));

describe('User Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRouter);
  });

  test('POST /register should call register controller', async () => {
    const res = await request(app).post('/api/users/register').send({
      firstName: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      username: 'john123',
      password: 'password',
      dob: '1990-01-01',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Registered');
  });

  test('POST /login should call login controller', async () => {
    const res = await request(app).post('/api/users/login').send({
      username: 'john123',
      password: 'password',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged in');
    expect(res.body.token).toBe('fake-token');
  });

  test('GET /profile should call getProfile controller', async () => {
    const res = await request(app).get('/api/users/profile');
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe('testuser');
  });

  test('PUT /profile should call updateProfile controller', async () => {
    const res = await request(app).put('/api/users/profile').send({ firstName: 'Jane' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile updated');
  });

  test('DELETE /delete should call deleteAccount controller', async () => {
    const res = await request(app).delete('/api/users/delete');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Account deleted');
  });
});
