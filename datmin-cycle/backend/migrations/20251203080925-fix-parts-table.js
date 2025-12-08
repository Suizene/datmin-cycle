'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hapus foreign key constraint jika ada
    await queryInterface.removeConstraint('Parts', 'Parts_motorcycle_id_fkey');
    
    // Hapus kolom motorcycle_id jika ada
    await queryInterface.removeColumn('Parts', 'motorcycle_id');
  },

  async down(queryInterface, Sequelize) {
    // Tidak perlu melakukan apa-apa di sini
  }
};