module.exports = (sequelize, DataTypes) => {

  const EnergyAccount = sequelize.define('EnergyAccount', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },

    meter_number: {
      type: DataTypes.STRING,
      allowNull: false
    },

    base_tariff: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true   // can be set later
    }

  }, {
    timestamps: true
  });

  EnergyAccount.associate = (models) => {

    EnergyAccount.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    EnergyAccount.hasMany(models.EnergyPurchase, {
      foreignKey: 'energy_account_id',
      as: 'purchases'
    });

    EnergyAccount.hasMany(models.Appliance, {
      foreignKey: 'energy_account_id',
      as: 'appliances'
    });

    EnergyAccount.hasMany(models.ConsumptionLog, {
      foreignKey: 'energy_account_id',
      as: 'consumptionLogs'
    });

    EnergyAccount.hasOne(models.EnergyBalance, {
      foreignKey: 'energy_account_id',
      as: 'energyBalance'
    });
  };

  EnergyAccount.afterCreate(async (energyAccount, options) => {
    const { EnergyBalance } = sequelize.models;

    await EnergyBalance.create({
      energy_account_id: energyAccount.id,
      lifetime_units_purchased: 0,
      lifetime_units_consumed: 0,
      current_units: 0
    }, { transaction: options.transaction });
  });

  return EnergyAccount;
};