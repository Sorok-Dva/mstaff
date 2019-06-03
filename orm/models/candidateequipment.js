'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateEquipment = sequelize.define('CandidateEquipment', {
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {});
  CandidateEquipment.associate = function (models) {
    CandidateEquipment.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    CandidateEquipment.hasOne(models.Equipment, {
      foreignKey: 'id',
      as: 'equipment'
    });
  };
  return CandidateEquipment;
};