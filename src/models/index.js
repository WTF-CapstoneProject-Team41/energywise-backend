const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserModel = require('./user.model');
const ProfileModel = require('./profile.model');
const EnergyAccountModel = require('./energyAccount.model');
const EnergyPurchaseModel = require('./energyPurchase.model');
const ApplianceModel = require('./appliance.model');
const RecommendationModel = require('./recommendation.model');
const ProviderModel = require('./provider.model');

const db = {};
db.User = UserModel(sequelize, DataTypes);
db.Profile = ProfileModel(sequelize, DataTypes);
db.EnergyAccount = EnergyAccountModel(sequelize, DataTypes);
db.EnergyPurchase = EnergyPurchaseModel(sequelize, DataTypes);
db.Appliance = ApplianceModel(sequelize, DataTypes);
db.Recommendation = RecommendationModel(sequelize, DataTypes);
db.Provider = ProviderModel(sequelize, DataTypes);

// associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
