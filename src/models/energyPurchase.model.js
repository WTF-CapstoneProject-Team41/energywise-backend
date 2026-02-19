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

    purchase_date: DataTypes.DATE,
    amount_paid: DataTypes.DECIMAL(10,2),
    units_kwh: DataTypes.DECIMAL(10,2),
    source: DataTypes.STRING

  });

  EnergyPurchase.associate = (models) => {
    EnergyPurchase.belongsTo(models.EnergyAccount, {
      foreignKey: 'energy_account_id',
      as: 'energyAccount'
    });
  };

  return EnergyPurchase;
};
