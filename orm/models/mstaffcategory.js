'use strict';
module.exports = (sequelize, DataTypes) => {
  const MstaffCategory = sequelize.define('MstaffCategories', {
    name: DataTypes.STRING,
  }, {});
  MstaffCategory.associate = function (models) {

  };
  return MstaffCategory;
};