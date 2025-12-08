// models/Part.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Part = sequelize.define('Part', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    kmReplaced: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'km_replaced'
    },
    nextReplacementKm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'next_replacement_km'
    },
    lastReplaced: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'last_replaced'
    }
  }, {
    tableName: 'Parts',
    timestamps: true
  });

  Part.associate = (models) => {
    Part.belongsTo(models.Motorcycle, {
      foreignKey: {
        name: 'motorcycleId',
        field: 'motorcycle_id',
        allowNull: false
      },
      as: 'motorcycle'
    });
  };

  return Part;
};
