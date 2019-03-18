'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Groups', {
    name: DataTypes.STRING,
  }, {});
  Group.associate = function (models) {

  };
  return Group;
};