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

// Route untuk migrasi (sementara, hapus setelah digunakan)
router.get('/migrate-reset-token', async (req, res) => {
  try {
    // Cek koneksi database
    await sequelize.authenticate();
    
    // Jalankan migrasi
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='Users' AND column_name='resetToken';
    `);
    
    if (results.length === 0) {
      // Jika kolom belum ada, tambahkan
      await sequelize.query(`
        ALTER TABLE "Users" 
        ADD COLUMN "resetToken" VARCHAR(255),
        ADD COLUMN "resetTokenExpiry" TIMESTAMP;
      `);
      
      return res.json({ 
        success: true, 
        message: 'Kolom berhasil ditambahkan' 
      });
    } else {
      return res.json({ 
        success: true, 
        message: 'Kolom sudah ada' 
      });
    }
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error
    });
  }
});

module.exports = router;
