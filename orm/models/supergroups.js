'use strict';
module.exports = (sequelize, DataTypes) => {
  const SuperGroup = sequelize.define('SuperGroups', {
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    banner: DataTypes.STRING,
    domain_name: DataTypes.STRING,
    domain_enable: DataTypes.BOOLEAN,
  }, {});
  SuperGroup.associate = function (models) {

  };
  return SuperGroup;
};