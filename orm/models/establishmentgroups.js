'use strict';
module.exports = (sequelize, DataTypes) => {
  const EstablishmentGroup = sequelize.define('EstablishmentGroups', {
    id_es: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Establishments',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    id_group: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
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