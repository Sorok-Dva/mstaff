'use strict';
module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    username: DataTypes.STRING
  });

  User.associate = function (models) {
    models.User.hasMany(models.Task);
  };

  return User;
};