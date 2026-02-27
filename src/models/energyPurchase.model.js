module.exports = (sequelize, DataTypes) => {

  const EnergyPurchase = sequelize.define('EnergyPurchase', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    energy_account_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false
    },

    units_purchased: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: false
    },

    amount_paid: {
      type: DataTypes.DECIMAL(12,4),
      allowNull: true
    },

    source: {
      type: DataTypes.STRING,
      allowNull: false
    },

    token_id: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    timestamps: true
  });

  EnergyPurchase.associate = (models) => {
    EnergyPurchase.belongsTo(models.EnergyAccount, {
      foreignKey: 'energy_account_id',
      as: 'energyAccount'
    });
  };

  EnergyPurchase.afterCreate(async (purchase, options) => {

    const { EnergyBalance } = sequelize.models;

    if (!options.transaction) {
      throw new Error('Transaction required for EnergyPurchase');
    }

    const balance = await EnergyBalance.findOne({
      where: { energy_account_id: purchase.energy_account_id },
      transaction: options.transaction,
      lock: options.transaction.LOCK.UPDATE
    });

    if (!balance) {
      throw new Error('EnergyBalance not found for account');
    }

    const unitsPurchased = parseFloat(purchase.units_purchased);

    balance.lifetime_units_purchased =
      parseFloat(balance.lifetime_units_purchased) + unitsPurchased;

    balance.current_units =
      parseFloat(balance.current_units) + unitsPurchased;

    balance.last_updated = new Date();

    await balance.save({ transaction: options.transaction });
  });

  return EnergyPurchase;
};