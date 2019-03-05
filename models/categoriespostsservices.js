'use strict';
module.exports = (sequelize, DataTypes) => {
  const CategoriesPostsServices = sequelize.define('CategoriesPostsServices', {
    name: DataTypes.STRING
  }, {});
  CategoriesPostsServices.associate = function (models) {
    CategoriesPostsServices.hasMany(models.Post, {
      foreignKey: 'categoriesPS_id',
      sourceKey: 'id'
    });
    CategoriesPostsServices.hasMany(models.Service, {
      foreignKey: 'categoriesPS_id',
      sourceKey: 'id'
    });
  };
  return CategoriesPostsServices;
};