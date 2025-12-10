// backend/controllers/authController.js
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const { Sequelize } = require('sequelize');

// Validasi email
const isEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    if (!isEmail(email)) {
      return res.status(400).json({ message: 'Format email tidak valid' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    // Cek apakah user sudah ada
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'Email sudah terdaftar' 
      });
    }

    // Buat user baru (hashing ditangani oleh model hook)
    user = await User.create({ 
      name, 
      email, 
      password 
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    // Hapus password dari response
    const userData = user.get({ plain: true });
    delete userData.password;

    res.status(201).json({ 
      success: true,
      user: userData, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat registrasi' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email dan password harus diisi' 
      });
    }

    // Cek user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Email atau password salah' 
      });
    }

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Email atau password salah' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '24h' }
    );

    // Hapus password dari response
    const userData = user.get({ plain: true });
    delete userData.password;

    res.json({ 
      success: true,
      user: userData, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Terjadi kesalahan saat login' 
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email harus diisi' 
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Return success message even if email doesn't exist for security
      return res.status(200).json({ 
        success: true,
        message: 'Jika email terdaftar, instruksi reset password akan dikirim ke email Anda' 
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set token dan expiry (1 jam dari sekarang)
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    // Simpan token ke database
    await user.update({
      resetToken,
      resetTokenExpiry
    });

    // Generate reset URL based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? 'https://datmin-cycle.vercel.app' 
      : 'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${resetToken}`;
    
    // Log for development
    if (!isProduction) {
      console.log('Reset URL:', resetUrl);
      console.log('Reset Token:', resetToken);
    }

    res.status(200).json({
      success: true,
      message: 'Mengarahkan ke halaman reset password...',
      resetToken: resetToken, // Selalu kirim token untuk frontend
      resetUrl: resetUrl     // Kirim juga URL lengkap untuk memudahkan
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    // Validasi input
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token, password, dan konfirmasi password harus diisi'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password dan konfirmasi password tidak cocok'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter'
      });
    }

    // Cari user berdasarkan token
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Sequelize.Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token tidak valid atau sudah kadaluarsa'
      });
    }

    // Update password user
    user.password = password;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru Anda.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
