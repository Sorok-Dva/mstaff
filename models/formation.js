'use strict';
module.exports = (sequelize, DataTypes) => {
  const Formation = sequelize.define('Formation', {
    name: DataTypes.STRING
  }, {});
  Formation.associate = function (models) {

  };
  return Formation;
};