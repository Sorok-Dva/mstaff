'use strict';
module.exports = (sequelize, DataTypes) => {
  const Need = sequelize.define('Need', {
    name: DataTypes.STRING,
    es_id: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    post: DataTypes.STRING,
    contract_type: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    closed: DataTypes.BOOLEAN,
  }, {});
  Need.associate = function (models) {
    Need.hasOne(models.Establishment, {
      foreignKey: 'id',
      sourceKey: 'es_id',
      onDelete: 'CASCADE'
    });
    Need.hasOne(models.User, {
      foreignKey: 'id',
      sourceKey: 'createdBy'
    });
    Need.hasMany(models.NeedCandidate, {
      foreignKey: 'need_id',
      as: 'candidates'
    });
  };
  return Need;
};