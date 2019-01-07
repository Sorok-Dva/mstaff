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
    name: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {});
  CandidateSkill.associate = function (models) {
    CandidateSkill.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return CandidateSkill;
};