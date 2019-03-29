'use strict';
module.exports = (sequelize, DataTypes) => {
  const SuperGroup = sequelize.define('SuperGroups', {
    name: DataTypes.STRING,
  }, {});
  SuperGroup.associate = function (models) {
    
  };
  return SuperGroup;
};