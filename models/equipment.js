'use strict';
module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define('Equipment', {
    name: DataTypes.STRING
  }, {
    tableName: 'Equipments'
  });
  Equipment.associate = function (models) {
    Equipment.belongsTo(models.CandidateEquipment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Equipment;
};