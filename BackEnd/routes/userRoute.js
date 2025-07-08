const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile,deleteAccount } = require('../controller/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.delete("/delete", verifyToken, deleteAccount);


module.exports = router;
