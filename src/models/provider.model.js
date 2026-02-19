module.exports = (sequelize, DataTypes) => {

  const Provider = sequelize.define('Provider', {

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

    business_name: DataTypes.STRING,
    country: DataTypes.STRING,
    location: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    contact_phone: DataTypes.STRING,

    services_offered: DataTypes.TEXT,

    verification_status: {
      type: DataTypes.ENUM('PENDING','APPROVED','REJECTED'),
      defaultValue: 'PENDING'
    },

    rating: DataTypes.DECIMAL(3,2)

  });

  Provider.associate = (models) => {
    Provider.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Provider;
};
