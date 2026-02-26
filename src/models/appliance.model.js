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

    appliance_type: {
      type: DataTypes.STRING,
      allowNull: false
    },

    wattage: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },

    hours_per_day: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    },

    duty_cycle: {
      type: DataTypes.DECIMAL(3,2),  // e.g. 0.75
      allowNull: false,
      defaultValue: 1.0
    }

  }, {
    timestamps: true
  });

  Appliance.associate = (models) => {
    Appliance.belongsTo(models.EnergyAccount, {
      foreignKey: 'energy_account_id',
      as: 'energyAccount'
    });
  };

  return Appliance;
};