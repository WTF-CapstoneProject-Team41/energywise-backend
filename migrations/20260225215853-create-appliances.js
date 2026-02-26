'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appliances', {

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

      appliance_type: {
        type: Sequelize.STRING,
        allowNull: false
      },

      wattage: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },

      hours_per_day: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },

      duty_cycle: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 1.00
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
    await queryInterface.dropTable('Appliances');
  }
};