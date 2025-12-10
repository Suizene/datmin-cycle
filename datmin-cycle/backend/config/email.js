// backend/config/email.js
module.exports = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  from: `"${process.env.EMAIL_FROM_NAME || 'Datmin Cycle'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`
};
