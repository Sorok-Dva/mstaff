'use strict';
module.exports = (sequelize, DataTypes) => {
  const InvitationAts = sequelize.define('InvitationAts', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    es: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  }, {});
  InvitationAts.associate = function(models) {
    // associations can be defined here
  };
  return InvitationAts;
};