// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Get user profile (private)
router.get('/profile', auth, authController.getProfile);

// Login (public)
router.post('/login', authController.login);

// Register (public)
router.post('/register', authController.register);

// Forgot Password (public)
router.post('/forgot-password', authController.forgotPassword);

// Reset Password (public)
router.post('/reset-password', authController.resetPassword);

module.exports = router;
