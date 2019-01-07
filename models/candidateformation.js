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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE
  }, {});
  CandidateFormation.associate = function (models) {
    CandidateFormation.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return CandidateFormation;
};