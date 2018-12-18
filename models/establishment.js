'use strict';
module.exports = (sequelize, DataTypes) => {
  const Establishment = sequelize.define('Establishment', {
    name: DataTypes.STRING,
    finess: DataTypes.STRING,
    code: DataTypes.STRING,
    type: DataTypes.STRING,
    sector: DataTypes.STRING,
    address: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    town: DataTypes.STRING,
    status: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING,
    logo: DataTypes.STRING,
    domain_name: DataTypes.STRING,
    domain_enable: DataTypes.BOOLEAN
  }, {});
  Establishment.associate = function (models) {
    Establishment.hasOne(models.Demos, {
      foreignKey: 'es_name',
      has: 'demo'
    })
  };
  return Establishment;
};