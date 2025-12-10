// backend/services/emailService.js
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass
      }
    });
  }

  async sendPasswordResetEmail(email, token, name) {
    try {
      // Baca template email
      const templatePath = path.join(__dirname, '../templates/reset-password-email.ejs');
      const template = fs.readFileSync(templatePath, 'utf-8');
      
      // Render template dengan data
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
      const html = ejs.render(template, {
        name: name || 'Pengguna',
        resetLink,
        year: new Date().getFullYear()
      });

      // Konfigurasi email
      const mailOptions = {
        from: emailConfig.from,
        to: email,
        subject: 'Reset Password - Datmin Cycle',
        html: html
      };

      // Kirim email
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email terkirim: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Gagal mengirim email:', error);
      throw new Error('Gagal mengirim email reset password');
    }
  }
}

module.exports = new EmailService();
