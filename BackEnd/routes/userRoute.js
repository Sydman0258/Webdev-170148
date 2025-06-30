const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controller/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
