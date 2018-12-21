'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateKnowledge = sequelize.define('CandidateKnowledge', {
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
        model: 'Knowledge',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE
  }, {});
  CandidateKnowledge.associate = function(models) {
    CandidateKnowledge.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    CandidateKnowledge.hasOne(models.Knowledge, {
      foreignKey: 'id',
      as: 'knowledge'
    });
  };
  return CandidateKnowledge;
};