const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Motorcycle = sequelize.define('Motorcycle', {
    type: {
      type: DataTypes.ENUM('matic', 'bebek', 'manual'),
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currentKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'current_km'
    },
    plateNumber: {
      type: DataTypes.STRING,
      field: 'plate_number',
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    }
  }, {
    tableName: 'Motorcycles',
    timestamps: true
  });

  Motorcycle.associate = (models) => {
    Motorcycle.hasMany(models.Part, {
      foreignKey: {
        name: 'motorcycleId',
        field: 'motorcycle_id',
        allowNull: false
      },
      as: 'parts',   
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Motorcycle;
};
