'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pool = sequelize.define('Pool', {
    name: DataTypes.STRING
  }, {});
  Pool.associate = function (models) {
  };
  return Pool;
};