module.exports = (sequelize, DataTypes) => {

  const ConsumptionLog = sequelize.define('ConsumptionLog', {

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

    estimated_kwh_used: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    estimated_units_used: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    remaining_units: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    }

  }, {
    timestamps: true
  });

  ConsumptionLog.associate = (models) => {
    ConsumptionLog.belongsTo(models.EnergyAccount, {
      foreignKey: 'energy_account_id',
      as: 'energyAccount'
    });
  };

  return ConsumptionLog;
};