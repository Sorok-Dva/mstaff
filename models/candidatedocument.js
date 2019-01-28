'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateDocument = sequelize.define('CandidateDocument', {
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
    type: DataTypes.STRING,
    path: DataTypes.STRING
  }, {});
  CandidateDocument.associate = function (models) {
    CandidateDocument.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return CandidateDocument;
};