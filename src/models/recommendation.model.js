module.exports = (sequelize, DataTypes) => {

  const Recommendation = sequelize.define('Recommendation', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    energy_account_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    message: DataTypes.TEXT,
    type: DataTypes.ENUM('USAGE','COST','WARNING'),
    status: {
      type: DataTypes.ENUM('NEW','DISMISSED','ACTED'),
      defaultValue: 'NEW'
    }

  });

  Recommendation.associate = (models) => {
    Recommendation.belongsTo(models.EnergyAccount, {
      foreignKey: 'energy_account_id',
      as: 'energyAccount'
    });
  };

  return Recommendation;
};
