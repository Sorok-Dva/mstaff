'use strict';
module.exports = (sequelize, DataTypes) => {
  const Need = sequelize.define('Need', {
    name: DataTypes.STRING,
    es_id: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    post: DataTypes.STRING,
    service: DataTypes.STRING,
    diploma: DataTypes.STRING,
    contract_type: DataTypes.STRING,
    is_available: DataTypes.STRING,
    postal_code: DataTypes.STRING,
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