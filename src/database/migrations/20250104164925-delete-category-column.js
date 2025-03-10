'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('products', 'category');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createColumn('products', {
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  }
};
