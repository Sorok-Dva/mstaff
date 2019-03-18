'use strict';
module.exports = (sequelize, DataTypes) => {
  const EstablishmentGroup = sequelize.define('EstablishmentGroups', {
    name: DataTypes.STRING,
  }, {});
  EstablishmentGroup.associate = function (models) {
    EstablishmentGroup.belongsTo(models.Establishment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    EstablishmentGroup.belongsTo(models.Groups, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return EstablishmentGroup;
};