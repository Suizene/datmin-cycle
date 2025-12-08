'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hapus tabel lama jika ada
    await queryInterface.dropTable('Parts');

    // Buat tabel baru dengan struktur yang benar
    await queryInterface.createTable('Parts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      kmReplaced: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        field: 'km_replaced'
      },
      nextReplacementKm: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'next_replacement_km'
      },
      lastReplaced: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'last_replaced'
      },
      motorcycleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'motorcycle_id',
        references: {
          model: 'Motorcycles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Parts');
  }
};