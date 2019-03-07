'use strict';
module.exports = (sequelize, DataTypes) => {
  const EstablishmentReference = sequelize.define('EstablishmentReference', {
    name: DataTypes.STRING,
    finess_et: DataTypes.STRING,
    finess_ej: DataTypes.STRING,
    name_long: DataTypes.STRING,
    name_info: DataTypes.STRING,
    address_num: DataTypes.STRING,
    address_type: DataTypes.STRING,
    address_name: DataTypes.STRING,
    address_more: DataTypes.STRING,
    address_bp: DataTypes.STRING,
    address_code: DataTypes.STRING,
    address_dpt: DataTypes.STRING,
    address_dpt_name: DataTypes.STRING,
    address_town: DataTypes.STRING,
    phone: DataTypes.STRING,
    category: DataTypes.STRING,
    category_name: DataTypes.STRING,
    cat: DataTypes.STRING,
    cat_bis: DataTypes.STRING,
    siret: DataTypes.STRING,
    code_ape: DataTypes.STRING,
    code_mft: DataTypes.STRING,
    name_mft: DataTypes.STRING,
    code_sph: DataTypes.STRING,
    name_sph: DataTypes.STRING,
    open_date: DataTypes.STRING,
    allow_date: DataTypes.STRING,
    update_date: DataTypes.STRING,
    num_ec: DataTypes.STRING,
    y: DataTypes.STRING,
    x: DataTypes.STRING,
    lat: DataTypes.STRING,
    lon: DataTypes.STRING,
    es_id: DataTypes.INTEGER
  }, {});
  EstablishmentReference.associate = function (models) {
    EstablishmentReference.hasMany(models.Application, {
      foreignKey: 'ref_es_id',
      sourceKey: 'finess_et'
    });
  };
  return EstablishmentReference;
};