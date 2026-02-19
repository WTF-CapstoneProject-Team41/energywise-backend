'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recommendations', {
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

      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      type: {
        type: Sequelize.ENUM('USAGE','COST','WARNING'),
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM('NEW','DISMISSED','ACTED'),
        defaultValue: 'NEW'
      },

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
    await queryInterface.dropTable('Recommendations');
  }
};