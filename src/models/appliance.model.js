module.exports = (sequelize, DataTypes) => {

  const Appliance = sequelize.define('Appliance', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    energy_account_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    name: DataTypes.STRING,
    wattage: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    hours_per_day: DataTypes.DECIMAL(5,2),
    days_per_week: DataTypes.INTEGER

  });

  Appliance.associate = (models) => {
    Appliance.belongsTo(models.EnergyAccount, {
      foreignKey: 'energy_account_id',
      as: 'energyAccount'
    });
  };

  return Appliance;
};
