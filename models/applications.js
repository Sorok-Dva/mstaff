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
    last_renew: DataTypes.DATE
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
      sourceKey: 'wish_id'
    })
  };
  return Application;
};