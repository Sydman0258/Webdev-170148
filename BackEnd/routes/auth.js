const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
require('dotenv').config();

// JWT middleware (if you need it for protected routes)
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

// ✅ Register route
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
      password, // plain password - hashing is done in model
      dob,
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// ✅ Login route
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required." });

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
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
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
