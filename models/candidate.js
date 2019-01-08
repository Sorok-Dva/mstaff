'use strict';
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    es_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    photo: DataTypes.STRING,
    video: DataTypes.STRING,
    status: DataTypes.STRING,
    note: DataTypes.STRING,
    views: DataTypes.INTEGER
  }, {});
  Candidate.associate = (models) => {
    Candidate.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.Experience, {
      foreignKey: 'candidate_id',
      as: 'experiences'
    });
    Candidate.hasMany(models.Wish, {
      foreignKey: 'candidate_id',
      as: 'wishes'
    });
    Candidate.hasMany(models.Application, {
      foreignKey: 'candidate_id',
      as: 'applications'
    });
    Candidate.hasMany(models.CandidateQualification, {
      foreignKey: 'candidate_id',
      as: 'qualifications'
    });
    Candidate.hasMany(models.CandidateFormation, {
      foreignKey: 'candidate_id',
      as: 'formations'
    });
    Candidate.hasMany(models.CandidateSkill, {
      foreignKey: 'candidate_id',
      as: 'skills'
    });
    Candidate.hasMany(models.CandidateEquipment, {
      foreignKey: 'candidate_id',
      as: 'equipments'
    });
    Candidate.hasMany(models.CandidateSoftware, {
      foreignKey: 'candidate_id',
      as: 'softwares'
    });
  };
  return Candidate;
};