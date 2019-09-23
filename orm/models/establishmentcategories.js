'use strict';
module.exports = (sequelize, DataTypes) => {
  const EstablishmentCategories = sequelize.define('EstablishmentCategories', {
    name: DataTypes.STRING
  }, {});
  EstablishmentCategories.associate = function (models) {
    EstablishmentCategories.hasMany(models.Establishment, {
      foreignKey: 'type',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };
  return EstablishmentCategories;
};