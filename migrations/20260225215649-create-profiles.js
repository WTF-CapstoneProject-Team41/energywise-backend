'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Profiles', {

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },

      business_name: {
        type: Sequelize.STRING,
        allowNull: true
      },

      business_type: {
        type: Sequelize.STRING,
        allowNull: true
      },

      business_size: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      household_size: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      primary_power_source: {
        type: Sequelize.STRING,
        allowNull: true
      },

      city: {
        type: Sequelize.STRING,
        allowNull: true
      },

      country: {
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
    await queryInterface.dropTable('Profiles');
  }
};