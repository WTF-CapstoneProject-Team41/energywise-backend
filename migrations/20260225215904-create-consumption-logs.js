'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ConsumptionLogs', {

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

      estimated_kwh_used: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      estimated_units_used: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      remaining_units: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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
    await queryInterface.dropTable('ConsumptionLogs');
  }
};