'use strict';
module.exports = (sequelize, DataTypes) => {
  const Qualification = sequelize.define('Qualification', {
    name: DataTypes.STRING
  }, {});
  Qualification.associate = function(models) {
    Qualification.belongsTo(models.CandidateQualification, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Qualification;
};