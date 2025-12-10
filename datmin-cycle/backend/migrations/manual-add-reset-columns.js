const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Tambahkan kolom resetToken
      await queryInterface.addColumn('Users', 'resetToken', {
        type: DataTypes.STRING,
        allowNull: true
      });

      // Tambahkan kolom resetTokenExpiry
      await queryInterface.addColumn('Users', 'resetTokenExpiry', {
        type: DataTypes.DATE,
        allowNull: true
      });

      console.log('Successfully added reset token columns');
    } catch (error) {
      console.error('Error adding columns:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus kolom jika rollback
    await queryInterface.removeColumn('Users', 'resetToken');
    await queryInterface.removeColumn('Users', 'resetTokenExpiry');
  }
};
