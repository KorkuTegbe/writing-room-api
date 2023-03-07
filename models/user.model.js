const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
require('dotenv').config()

// creating User model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
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

  // hash password hook
  User.beforeCreate(async function(user) {
    password = user.password
    let oldEmail = user.email
    if(user.password){
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.email = oldEmail.toLowerCase();
    }
  });

  // create jwt  token
  User.prototype.createJwt = async function () {
    return await jwt.sign(
      { user_id: this.id},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES },
    );
  };

  // compare password instance
  User.prototype.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }

  return User;
};
