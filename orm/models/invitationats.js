'use strict';
module.exports = (sequelize, DataTypes) => {
  const InvitationAts = sequelize.define('InvitationAts', {
    key: DataTypes.STRING,
    es: DataTypes.JSON
  }, {});
  InvitationAts.associate = function (models) {
    // associations can be defined here
  };
  return InvitationAts;
};