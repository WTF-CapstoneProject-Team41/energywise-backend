module.exports = (sequelize, DataTypes) => {

  const Profile = sequelize.define('Profile', {

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

    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    business_name: DataTypes.STRING,
    country: DataTypes.STRING

  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Profile;
};
