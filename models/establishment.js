'use strict';
module.exports = (sequelize, DataTypes) => {
  const Establishment = sequelize.define('Establishment', {
    name: DataTypes.STRING,
    finess: DataTypes.STRING,
    finess_ej: DataTypes.STRING,
    siret: DataTypes.STRING,
    code: DataTypes.STRING,
    type: DataTypes.STRING,
    sector: DataTypes.STRING,
    address: DataTypes.STRING,
    town: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING,
    logo: DataTypes.STRING,
    domain_name: DataTypes.STRING,
    domain_enable: DataTypes.BOOLEAN,
    salaries_count: DataTypes.INTEGER
  }, {});
  Establishment.associate = function (models) {
    Establishment.hasOne(models.Demo, {
      foreignKey: 'es_name',
      as: 'demo'
    });
    Establishment.hasMany(models.ESAccount, {
      foreignKey: 'es_id',
      sourceKey: 'id'
    });
    Establishment.hasMany(models.FavoriteCandidate, {
      foreignKey: 'es_id',
      sourceKey: 'id'
    });
    Establishment.hasMany(models.ArchivedCandidate, {
      foreignKey: 'es_id',
      sourceKey: 'id'
    });
  };
  return Establishment;
};