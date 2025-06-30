const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
require('dotenv').config();

// JWT middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// REGISTER
router.post('/api/register', async (req, res) => {
  const { firstName, surname, email, username, password, dob } = req.body;

  if (!firstName || !surname || !email || !username || !password || !dob) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ error: "Email already registered." });

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) return res.status(400).json({ error: "Username already taken." });

    const newUser = await User.create({
      firstName,
      surname,
      email,
      username,
      password, // plain password — Sequelize hook hashes it
      dob,
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// LOGIN
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required." });

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: "User not found." });

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid password." });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// GET PROFILE
router.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: { id: userId },
      attributes: [
        'id', 'firstName', 'surname', 'email', 'username', 'dob',
        'cardNumber', 'expiry', 'cvv'
      ]
    });

    if (!user) return res.status(404).json({ error: "User not found." });

    const { cardNumber, expiry, cvv, ...profileData } = user.dataValues;

    res.json({
      user: profileData,
      payment: { cardNumber, expiry, cvv }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// UPDATE PROFILE
router.put('/api/profile', verifyToken, async (req, res) => {
  const { firstName, surname, email, username, dob, payment } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found." });

    user.firstName = firstName || user.firstName;
    user.surname = surname || user.surname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.dob = dob || user.dob;

    if (payment) {
      user.cardNumber = payment.cardNumber || user.cardNumber;
      user.expiry = payment.expiry || user.expiry;
      user.cvv = payment.cvv || user.cvv;
    }

    await user.save();

    res.json({ message: "Profile updated successfully.", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

module.exports = router;
