module.exports = (sequelize, DataTypes) => {

  const EnergyBalance = sequelize.define('EnergyBalance', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    energy_account_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true // one balance per account
    },

    lifetime_units_purchased: {
      type: DataTypes.DECIMAL(14,4),
      allowNull: false,
      defaultValue: 0
    },

    lifetime_units_consumed: {
      type: DataTypes.DECIMAL(14,4),
      allowNull: false,
      defaultValue: 0
    },

    current_units: {
      type: DataTypes.DECIMAL(14,4),
      allowNull: false,
      defaultValue: 0
    },

    days_remaining: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },

    forecast_depletion_date: {
      type: DataTypes.DATE,
      allowNull: true
    },

    last_updated: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ['energy_account_id']
      }
    ]
  });

  EnergyBalance.associate = (models) => {
    EnergyBalance.belongsTo(models.EnergyAccount, {
      foreignKey: 'energy_account_id',
      as: 'energyAccount',
      onDelete: 'CASCADE'
    });
  };

  return EnergyBalance;
};