// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../model/userSchema'); // Your Sequelize User model
const bcrypt = require('bcrypt');

// Register route
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      surname,
      email,
      username,
      password: hashedPassword,
      dob,
    });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

// Login route
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required." });

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: "User not found." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password." });

    // TODO: Generate JWT token or session here if needed

    res.json({ message: "Login successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
