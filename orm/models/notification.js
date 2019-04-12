'use strict';
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    fromUser: DataTypes.INTEGER,
    fromEs: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    read: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    subject: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    opts: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('opts'))
      },
      set(data) {
        this.setDataValue('opts', JSON.stringify(data));
      }
    },
    image: DataTypes.STRING
  }, {});
  Notification.associate = function (models) {
    // associations can be defined here
  };
  return Notification;
};