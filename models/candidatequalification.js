'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateQualification = sequelize.define('CandidateQualification', {
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
      type: DataTypes.STRING
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE
  }, {});
  CandidateQualification.associate = function (models) {
    CandidateQualification.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    CandidateQualification.hasOne(models.Qualification, {
      foreignKey: 'id',
      as: 'diploma'
    });
  };
  return CandidateQualification;
};