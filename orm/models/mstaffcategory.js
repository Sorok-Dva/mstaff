'use strict';
module.exports = (sequelize, DataTypes) => {
  const MstaffCategory = sequelize.define('MstaffCategories', {
    name: DataTypes.STRING,
    medical: DataTypes.BOOLEAN,
    paramedical: DataTypes.BOOLEAN,
    admin_and_tech: DataTypes.BOOLEAN,
    liberal: DataTypes.BOOLEAN,
    cdi_cdd: DataTypes.BOOLEAN,
    vacation: DataTypes.BOOLEAN,
    internship: DataTypes.BOOLEAN,
    service: DataTypes.BOOLEAN
  }, {});
  MstaffCategory.associate = function (models) {

  };
  return MstaffCategory;
};