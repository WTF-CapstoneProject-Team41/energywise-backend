'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // 1️⃣ Change date column to DATEONLY
    await queryInterface.changeColumn('ConsumptionLogs', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });

    // 2️⃣ Add index on energy_account_id
    await queryInterface.addIndex('ConsumptionLogs', ['energy_account_id']);

    // 3️⃣ Add index on date
    await queryInterface.addIndex('ConsumptionLogs', ['date']);

    // 4️⃣ Add composite unique index (account + date)
    await queryInterface.addIndex(
      'ConsumptionLogs',
      ['energy_account_id', 'date'],
      {
        unique: true,
        name: 'unique_account_date'
      }
    );
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeIndex('ConsumptionLogs', 'unique_account_date');
    await queryInterface.removeIndex('ConsumptionLogs', ['energy_account_id']);
    await queryInterface.removeIndex('ConsumptionLogs', ['date']);

    await queryInterface.changeColumn('ConsumptionLogs', 'date', {
      type: Sequelize.DATE,
      allowNull: false
    });

  }
};