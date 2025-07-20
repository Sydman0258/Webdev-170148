// userController.test.js
const userController = require('../controller/userController');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

// Mock User model methods
jest.mock('../model/User', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
}));

// Mock jsonwebtoken sign
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked-jwt-token'),
}));

describe('User Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 1 },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should return 400 if required fields missing', async () => {
      mockReq.body = {}; // empty body

      await userController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "All fields are required." });
    });

    test('should return 400 if email already registered', async () => {
      mockReq.body = { firstName: 'A', surname: 'B', email: 'a@b.com', username: 'user', password: 'pass', dob: '2000-01-01' };
      User.findOne.mockImplementation(({ where }) => {
        if (where.email) return Promise.resolve(true);
        return Promise.resolve(null);
      });

      await userController.register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Email already registered." });
    });

    test('should return 400 if username already taken', async () => {
      mockReq.body = { firstName: 'A', surname: 'B', email: 'a@b.com', username: 'user', password: 'pass', dob: '2000-01-01' };
      User.findOne.mockImplementation(({ where }) => {
        if (where.email) return Promise.resolve(null);
        if (where.username) return Promise.resolve(true);
        return Promise.resolve(null);
      });

      await userController.register(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'user' } });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Username already taken." });
    });

    test('should create user and respond with 201', async () => {
      mockReq.body = { firstName: 'A', surname: 'B', email: 'a@b.com', username: 'user', password: 'pass', dob: '2000-01-01' };
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, ...mockReq.body });

      await userController.register(mockReq, mockRes);

      expect(User.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "User registered successfully." });
    });
  });

  describe('login', () => {
    test('should return 400 if username or password missing', async () => {
      mockReq.body = {};

      await userController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Username and password required." });
    });

    test('should return 400 if user not found', async () => {
      mockReq.body = { username: 'user', password: 'pass' };
      User.findOne.mockResolvedValue(null);

      await userController.login(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'user' } });
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found." });
    });

    test('should return 400 if password invalid', async () => {
      mockReq.body = { username: 'user', password: 'wrongpass' };
      const mockUser = {
        id: 1,
        username: 'user',
        email: 'a@b.com',
        isAdmin: false,
        validPassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      await userController.login(mockReq, mockRes);

      expect(mockUser.validPassword).toHaveBeenCalledWith('wrongpass');
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid password." });
    });

    test('should return token and user info on successful login', async () => {
      mockReq.body = { username: 'user', password: 'correctpass' };
      const mockUser = {
        id: 1,
        username: 'user',
        email: 'a@b.com',
        isAdmin: true,
        validPassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);

      await userController.login(mockReq, mockRes);

      expect(mockUser.validPassword).toHaveBeenCalledWith('correctpass');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, username: mockUser.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Login successful.",
        token: 'mocked-jwt-token',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          isAdmin: mockUser.isAdmin,
        },
      });
    });
  });

  describe('getProfile', () => {
    test('should return user profile data', async () => {
      const mockUserData = {
        dataValues: {
          id: 1,
          firstName: 'A',
          surname: 'B',
          email: 'a@b.com',
          username: 'user',
          dob: '2000-01-01',
          cardNumber: '1234',
          expiry: '12/25',
          cvv: '123',
        },
      };
      User.findOne.mockResolvedValue(mockUserData);

      await userController.getProfile(mockReq, mockRes);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        attributes: ['id', 'firstName', 'surname', 'email', 'username', 'dob', 'cardNumber', 'expiry', 'cvv'],
      });

      expect(mockRes.json).toHaveBeenCalledWith({
        user: {
          id: 1,
          firstName: 'A',
          surname: 'B',
          email: 'a@b.com',
          username: 'user',
          dob: '2000-01-01',
        },
        payment: {
          cardNumber: '1234',
          expiry: '12/25',
          cvv: '123',
        },
      });
    });

    test('should return 404 if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found." });
    });
  });

  describe('updateProfile', () => {
    test('should update user profile', async () => {
      mockReq.body = {
        firstName: 'NewFirst',
        surname: 'NewSurname',
        email: 'new@mail.com',
        username: 'newuser',
        dob: '1990-01-01',
        payment: { cardNumber: '9999', expiry: '11/30', cvv: '321' },
      };

      const mockUser = {
        firstName: 'A',
        surname: 'B',
        email: 'a@b.com',
        username: 'user',
        dob: '2000-01-01',
        cardNumber: '1234',
        expiry: '12/25',
        cvv: '123',
        save: jest.fn(),
      };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.updateProfile(mockReq, mockRes);

      expect(mockUser.firstName).toBe('NewFirst');
      expect(mockUser.surname).toBe('NewSurname');
      expect(mockUser.email).toBe('new@mail.com');
      expect(mockUser.username).toBe('newuser');
      expect(mockUser.dob).toBe('1990-01-01');
      expect(mockUser.cardNumber).toBe('9999');
      expect(mockUser.expiry).toBe('11/30');
      expect(mockUser.cvv).toBe('321');
      expect(mockUser.save).toHaveBeenCalled();

      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Profile updated successfully.",
        user: mockUser,
      });
    });

    test('should return 404 if user not found for update', async () => {
      User.findByPk.mockResolvedValue(null);

      await userController.updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found." });
    });
  });

  describe('deleteAccount', () => {
    test('should delete user account', async () => {
      const mockUser = { destroy: jest.fn() };
      User.findByPk.mockResolvedValue(mockUser);

      await userController.deleteAccount(mockReq, mockRes);

      expect(mockUser.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Account deleted successfully." });
    });

    test('should return 404 if user not found for deletion', async () => {
      User.findByPk.mockResolvedValue(null);

      await userController.deleteAccount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "User not found." });
    });
  });
});
