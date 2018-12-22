'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateEquipment = sequelize.define('CandidateEquipment', {
    candidate_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Candidate',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      allowNull: false
    },
    equipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Equipment',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE
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