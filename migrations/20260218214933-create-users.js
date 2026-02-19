'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },

      phone: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },

      password_hash: {
        type: Sequelize.STRING,
        allowNull: true
      },

      google_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },

      role: {
        type: Sequelize.ENUM('USER','PROVIDER','ADMIN'),
        defaultValue: 'USER'
      },

      account_status: {
        type: Sequelize.ENUM('ACTIVE','SUSPENDED','PENDING'),
        defaultValue: 'ACTIVE'
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};
