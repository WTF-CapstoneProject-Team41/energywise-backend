'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appliances', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },

      energy_account_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'EnergyAccounts',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      name: Sequelize.STRING,
      wattage: Sequelize.INTEGER,
      quantity: Sequelize.INTEGER,
      hours_per_day: Sequelize.DECIMAL(5,2),
      days_per_week: Sequelize.INTEGER,

      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },

      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Appliances');
  }
};