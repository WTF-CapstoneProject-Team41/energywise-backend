'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'user_type', {
      type: Sequelize.ENUM('HOUSEHOLD', 'SME'),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'user_type', {
      type: Sequelize.ENUM('HOME', 'SME'),
      allowNull: true
    });
  }
};