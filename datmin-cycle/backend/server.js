require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const motorcycleRoutes = require('./routes/motorcycles');
const db = require('./models');

const app = express();

// CORS Configuration (allow all origins for now, including Netlify)
const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());

// Set view engine for email templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/motorcycles', motorcycleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Test database connection and start server
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await db.sequelize.sync();
    console.log('Database synchronized');
    
    // Start server
    const server = app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
      console.log(`API Documentation: http://${HOST}:${PORT}/api-docs`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();