'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Cek apakah kolom sudah ada
      const [results] = await queryInterface.sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='Users' AND column_name='resetToken';
      `);
      
      if (results.length === 0) {
        // Tambahkan kolom jika belum ada
        await queryInterface.addColumn('Users', 'resetToken', {
          type: Sequelize.STRING,
          allowNull: true
        });
        
        await queryInterface.addColumn('Users', 'resetTokenExpiry', {
          type: Sequelize.DATE,
          allowNull: true
        });
        
        console.log('Kolom berhasil ditambahkan');
      } else {
        console.log('Kolom sudah ada');
      }
    } catch (error) {
      console.error('Error in migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus kolom jika rollback
    await queryInterface.removeColumn('Users', 'resetToken');
    await queryInterface.removeColumn('Users', 'resetTokenExpiry');
  }
};
