'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('EnergyBalances', {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },

      energy_account_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
      },

      lifetime_units_purchased: {
        type: Sequelize.DECIMAL(14,4),
        allowNull: false,
        defaultValue: 0
      },

      lifetime_units_consumed: {
        type: Sequelize.DECIMAL(14,4),
        allowNull: false,
        defaultValue: 0
      },

      current_units: {
        type: Sequelize.DECIMAL(14,4),
        allowNull: false,
        defaultValue: 0
      },

      days_remaining: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
      },

      forecast_depletion_date: {
        type: Sequelize.DATE,
        allowNull: true
      },

      last_updated: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addIndex('EnergyBalances', ['energy_account_id'], {
      unique: true,
      name: 'unique_energy_account_balance'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('EnergyBalances');
  }
};