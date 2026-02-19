module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },

    password_hash: {
      type: DataTypes.STRING,
      allowNull: true
    },

    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },

    role: {
      type: DataTypes.ENUM('USER', 'PROVIDER', 'ADMIN'),
      defaultValue: 'USER'
    },

    account_status: {
      type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'PENDING'),
      defaultValue: 'ACTIVE'
    }

  });

  User.associate = (models) => {

     User.hasOne(models.Profile, {
      foreignKey: 'user_id',
      as: 'profile'
    });

     User.hasOne(models.EnergyAccount, {
      foreignKey: 'user_id',
      as: 'energyAccount'
    });

    User.hasOne(models.Provider, {
      foreignKey: 'user_id',
      as: 'providerProfile'
    });
  };

  return User;
};
