'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Providers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      business_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      country: {
        type: Sequelize.STRING,
        allowNull: false
      },

      location: {
        type: Sequelize.STRING,
        allowNull: false
      },

      contact_email: Sequelize.STRING,
      contact_phone: Sequelize.STRING,

      services_offered: Sequelize.TEXT,

      verification_status: {
        type: Sequelize.ENUM('PENDING','APPROVED','REJECTED'),
        defaultValue: 'PENDING'
      },

      rating: {
        type: Sequelize.DECIMAL(3,2),
        allowNull: true
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
    await queryInterface.dropTable('Providers');
  }
};
