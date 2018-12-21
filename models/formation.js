'use strict';
module.exports = (sequelize, DataTypes) => {
  const Formation = sequelize.define('Formation', {
    name: DataTypes.STRING
  }, {});
  Formation.associate = function(models) {
    Formation.belongsTo(models.CandidateFormation, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Formation;
};