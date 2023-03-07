// creating User model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      tableName: "users",
    }
  );

  return User;
};
