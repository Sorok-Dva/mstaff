'use strict';
module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define('Equipment', {
    name: DataTypes.STRING
  }, {});
  Equipment.associate = function(models) {
    Equipment.belongsTo(models.CandidateEquipment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Equipment;
};