'use strict';
module.exports = (sequelize, DataTypes) => {
  const EstablishmentTypes = sequelize.define('EstablishmentTypes', {
    name: {
      type: DataTypes.STRING
    }
  }, {});
  EstablishmentTypes.associate = function (models) {
    EstablishmentTypes.hasMany(models.Establishment, {
      foreignKey: 'type_id',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };
  return EstablishmentTypes;
};