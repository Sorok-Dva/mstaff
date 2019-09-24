'use strict';
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    es_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    video: DataTypes.STRING,
    status: DataTypes.STRING,
    note: DataTypes.STRING,
    views: DataTypes.INTEGER,
    percentage: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('percentage'))
      },
      set(data) {
        this.setDataValue('percentage', JSON.stringify(data));
      }
    },
    is_available: DataTypes.BOOLEAN
  }, {});
  Candidate.associate = (models) => {
    Candidate.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.Experience, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'experiences',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.Wish, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'wishes',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.Application, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'applications',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.CandidateQualification, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'qualifications',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.CandidateFormation, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'formations',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.CandidateSkill, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'skills',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.CandidateEquipment, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'equipments',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.CandidateSoftware, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'softwares',
      onDelete: 'CASCADE'
    });
    Candidate.hasMany(models.CandidateDocument, {
      foreignKey: 'candidate_id',
      sourceKey: 'id',
      as: 'documents',
      onDelete: 'CASCADE'
    });
  };
  return Candidate;
};