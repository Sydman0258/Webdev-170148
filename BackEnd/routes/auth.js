const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../model/User'); // Adjust if necessary

// ========== Nodemailer setup (Gmail) ==========
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      // Gmail address
    pass: process.env.EMAIL_PASS,      // Gmail App Password (not regular password)
  },
});

// ========== POST /api/auth/forgot-password ==========
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendURL}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Email error:', err);
        return res.status(500).json({ message: 'Failed to send email.' });
      }
      console.log('📧 Email sent:', info.response);
      return res.json({ message: 'Password reset link sent to your email.' });
    });
  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== POST /api/auth/reset-password/:token ==========
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return res.json({ message: 'Password reset successful.' });
  } catch (err) {
    console.error('❌ Token error:', err);
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

module.exports = router;
