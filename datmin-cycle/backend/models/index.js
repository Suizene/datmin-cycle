// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

let sequelize;

if (config.use_env_variable) {
  // Production on Railway: use DATABASE_URL with SSL/dialectOptions from config
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: config.dialect,
    logging: config.logging,
    dialectOptions: config.dialectOptions || {}
  });
} else {
  // Local development/test: use individual credentials from config
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging,
      dialectOptions: config.dialectOptions || {}
    }
  );
}

// Import models
const models = {
  User: require('./User')(sequelize, DataTypes),
  Motorcycle: require('./Motorcycle')(sequelize, DataTypes),
  Part: require('./Part')(sequelize, DataTypes)
};

// Jalankan asosiasi jika ada
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

// Tambahkan sequelize & Sequelize agar bisa diakses di luar
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
