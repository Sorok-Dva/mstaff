'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    fromUser: DataTypes.INTEGER,
    fromEs: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    title: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  Notification.associate = function (models) {
    // associations can be defined here
  };
  return Notification;
};