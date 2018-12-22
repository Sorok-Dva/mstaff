'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateFormation = sequelize.define('CandidateFormation', {
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
    formation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Formation',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE
  }, {});
  CandidateFormation.associate = function (models) {
    CandidateFormation.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    CandidateFormation.hasOne(models.Formation, {
      foreignKey: 'id',
      as: 'formation'
    });
  };
  return CandidateFormation;
};