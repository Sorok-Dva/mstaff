'use strict';
module.exports = (sequelize, DataTypes) => {
  const EstablishmentGroup = sequelize.define('EstablishmentGroups', {
    id_es: DataTypes.INTEGER,
    id_group: DataTypes.INTEGER
  }, {});
  EstablishmentGroup.associate = function (models) {
    EstablishmentGroup.belongsTo(models.Establishment, {
      foreignKey: 'id',
      onDelete: 'CASCADE',
      as: 'es'
    });
    EstablishmentGroup.belongsTo(models.Groups, {
      foreignKey: 'id',
      onDelete: 'CASCADE',
    });
  };
  return EstablishmentGroup;
};