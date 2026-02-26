'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EnergyPurchases', {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      energy_account_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'EnergyAccounts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      date: {
        type: Sequelize.DATE,
        allowNull: false
      },

      units_purchased: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      amount_paid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      source: {
        type: Sequelize.STRING,
        allowNull: false
      },

      token_id: {
        type: Sequelize.STRING,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('EnergyPurchases');
  }
};