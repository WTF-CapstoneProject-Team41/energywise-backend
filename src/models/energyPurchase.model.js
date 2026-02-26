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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
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

  return EnergyPurchase;
};