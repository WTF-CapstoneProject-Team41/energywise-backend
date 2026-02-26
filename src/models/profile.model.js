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

    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },

    business_name: {
      type: DataTypes.STRING,
      allowNull: true
    },

    business_type: {
      type: DataTypes.STRING,  // VARCHAR for MVP
      allowNull: true
    },

    business_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    household_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    primary_power_source: {
      type: DataTypes.STRING,
      allowNull: true
    },

    city: {
      type: DataTypes.STRING,
      allowNull: true
    },

    country: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    timestamps: true
  });

  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Profile;
};