const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config();

const register = async (req, res) => {
  const { firstName, surname, email, username, password, dob } = req.body;

  if (!firstName || !surname || !email || !username || !password || !dob) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) return res.status(400).json({ error: "Email already registered." });

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) return res.status(400).json({ error: "Username already taken." });

    await User.create({ firstName, surname, email, username, password, dob });

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
};

const login = async (req, res) => {
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
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
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
};

const updateProfile = async (req, res) => {
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
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    await user.destroy();
    res.json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete account." });
  }
};


module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount
};
