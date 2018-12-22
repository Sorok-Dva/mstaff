'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateSkill = sequelize.define('CandidateSkill', {
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
    knowledge_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Skill',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE
  }, {});
  CandidateSkill.associate = function (models) {
    CandidateSkill.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    CandidateSkill.hasOne(models.Skill, {
      foreignKey: 'id',
      as: 'skill'
    });
  };
  return CandidateSkill;
};