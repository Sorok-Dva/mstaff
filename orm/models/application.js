'use strict';
module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('Application', {
    name: DataTypes.STRING,
    wish_id: DataTypes.INTEGER,
    candidate_id: DataTypes.INTEGER,
    es_id: DataTypes.INTEGER,
    ref_es_id: DataTypes.INTEGER,
    percentage: DataTypes.FLOAT,
    accepted: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    type: DataTypes.STRING,
    new: DataTypes.BOOLEAN,
    renewed: DataTypes.BOOLEAN,
    last_renew: DataTypes.DATE,
    is_available: DataTypes.BOOLEAN
  }, {});
  Application.associate = function (models) {
    Application.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Application.belongsTo(models.Establishment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Application.hasOne(models.Wish, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Application.hasOne(models.EstablishmentReference, {
      foreignKey: 'finess_et',
      sourceKey: 'ref_es_id',
      onDelete: 'CASCADE',
    })
  };
  return Application;
};