'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Parts', 'motorcycle_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Motorcycles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Parts', 'motorcycle_id');
  }
};