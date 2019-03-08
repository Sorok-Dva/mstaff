'use strict';
module.exports = (sequelize, DataTypes) => {
  const Need = sequelize.define('Need', {
    name: DataTypes.STRING,
    es_id: DataTypes.INTEGER,
    post: DataTypes.STRING,
    contract_type: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE
  }, {});
  Need.associate = function (models) {
    Need.hasOne(models.Establishment, {
      foreignKey: 'id',
      sourceKey: 'es_id',
      onDelete: 'CASCADE'
    });

    Need.hasMany(models.NeedCandidate, {
      foreignKey: 'need_id',
      as: 'candidates'
    });
  };
  return Need;
};