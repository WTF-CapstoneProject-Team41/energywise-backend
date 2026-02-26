const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./user.model');
const ProfileModel = require('./profile.model');
const EnergyAccountModel = require('./energyAccount.model');
const EnergyPurchaseModel = require('./energyPurchase.model');
const ApplianceModel = require('./appliance.model');
const ConsumptionLogModel = require('./consumptionLog.model');
const EnergyBalanceModel = require('./energyBalance.model');

const db = {};
db.User = UserModel(sequelize, DataTypes);
db.Profile = ProfileModel(sequelize, DataTypes);
db.EnergyAccount = EnergyAccountModel(sequelize, DataTypes);
db.EnergyPurchase = EnergyPurchaseModel(sequelize, DataTypes);
db.ConsumptionLog = ConsumptionLogModel(sequelize, DataTypes);
db.Appliance = ApplianceModel(sequelize, DataTypes);
db.EnergyBalance = EnergyBalanceModel(sequelize, DataTypes);

// associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
