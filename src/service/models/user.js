'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    email: {
      type: DataTypes.STRING,
      uniqueKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    timestamps: false,
    paranoid: false,
    tableName: `users`
  });

  return User;
};

