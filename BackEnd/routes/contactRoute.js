// routes/contactRoute.js
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    await sendEmail({ name, email, message });
    res.status(200).json({ message: '✅ Message sent to your inbox!' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: '❌ Failed to send email.' });
  }
});

module.exports = router;
