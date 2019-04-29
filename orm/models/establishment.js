'use strict';
module.exports = (sequelize, DataTypes) => {
  const Establishment = sequelize.define('Establishment', {
    name: DataTypes.STRING,
    category: DataTypes.STRING,
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
    banner: DataTypes.STRING,
    domain_name: DataTypes.STRING,
    domain_enable: DataTypes.BOOLEAN,
    salaries_count: DataTypes.INTEGER,
    contact_identity: DataTypes.STRING,
    contact_post: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    contact_phone: DataTypes.STRING
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
    Establishment.hasMany(models.Need, {
      foreignKey: 'es_id',
      sourceKey: 'id'
    });
    Establishment.hasMany(models.Application, {
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