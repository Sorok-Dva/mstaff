'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteCandidate = sequelize.define('FavoriteCandidate', {
    es_id: DataTypes.INTEGER,
    candidate_id: DataTypes.INTEGER,
    added_by: DataTypes.INTEGER
  }, {});
  FavoriteCandidate.associate = function (models) {
    FavoriteCandidate.hasOne(models.Establishment, {
      foreignKey: 'id',
      sourceKey: 'es_id',
      onDelete: 'CASCADE'
    });
    FavoriteCandidate.hasOne(models.User, {
      foreignKey: 'id',
      sourceKey: 'added_by',
      onDelete: 'CASCADE'
    });
    FavoriteCandidate.hasOne(models.Candidate, {
      foreignKey: 'id',
      sourceKey: 'candidate_id',
      onDelete: 'CASCADE'
    });
  };
  return FavoriteCandidate;
};