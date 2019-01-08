'use strict';
module.exports = (sequelize, DataTypes) => {
  const Applications = sequelize.define('Applications', {
    offer_id: DataTypes.INTEGER,
    candidate_id: DataTypes.INTEGER,
    es_id: DataTypes.INTEGER,
    percentage: DataTypes.FLOAT,
    accepted: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    type: DataTypes.STRING,
    new: DataTypes.BOOLEAN
  }, {});
  Applications.associate = function(models) {
    Applications.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Applications.belongsTo(models.Establishment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Applications;
};