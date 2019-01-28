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
    filename: DataTypes.STRING,
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: ['CNI', 'VIT', 'RIB', 'DIP', 'OrNa', 'CV', 'LM', 'ADELI'],
    },
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