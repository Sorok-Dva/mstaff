'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArchivedCandidate = sequelize.define('ArchivedCandidate', {
    es_id: DataTypes.INTEGER,
    candidate_id: DataTypes.INTEGER,
    added_by: DataTypes.INTEGER
  }, {});
  ArchivedCandidate.associate = function (models) {
    ArchivedCandidate.hasOne(models.Establishment, {
      foreignKey: 'id',
      sourceKey: 'es_id',
      onDelete: 'CASCADE'
    });
    ArchivedCandidate.hasOne(models.User, {
      foreignKey: 'id',
      sourceKey: 'added_by',
      onDelete: 'CASCADE'
    });
    ArchivedCandidate.hasOne(models.Candidate, {
      foreignKey: 'id',
      sourceKey: 'candidate_id',
      onDelete: 'CASCADE'
    });
  };
  return ArchivedCandidate;
};