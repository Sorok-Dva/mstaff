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
    contact_phone: DataTypes.STRING,
    user_address: DataTypes.STRING,
    formatted_address: DataTypes.STRING,
    street_number: DataTypes.STRING,
    street_name: DataTypes.STRING,
    city: DataTypes.STRING,
    department: DataTypes.STRING,
    region: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    lat: DataTypes.DECIMAL(10, 8),
    lng: DataTypes.DECIMAL(11, 8),
    structure_number: DataTypes.STRING,
    attachement_direction: DataTypes.STRING,
    region_code: DataTypes.STRING,
    long_wording: DataTypes.STRING,
    spinneret: DataTypes.STRING,
    primary_group_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Groups',
        key: 'id',
      },
      onUpdate: 'CASCADE'
    },
    location_updatedAt: DataTypes.DATE,
  }, {});
  Establishment.associate = function (models) {
    Establishment.hasOne(models.EstablishmentReference, {
      foreignKey: 'finess_et',
      as: 'ref'
    });
    Establishment.hasOne(models.Subdomain, {
      foreignKey: 'es_id',
      as: 'subdomain'
    });
    Establishment.hasMany(models.UsersGroups, {
      foreignKey: 'es_id',
      sourceKey: 'id'
    });
    Establishment.hasMany(models.Need, {
      foreignKey: 'es_id',
      sourceKey: 'id'
    });
    Establishment.hasMany(models.Offer, {
      foreignKey: 'es_id',
      sourceKey: 'id',
      as: 'offers'
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
    Establishment.hasMany(models.EstablishmentGroups, {
      foreignKey: 'id_es',
      sourceKey: 'id',
      onDelete: 'CASCADE'
    });
    Establishment.belongsTo(models.Groups, {
      foreignKey: 'primary_group_id',
      targetKey: 'id'
    });
    Establishment.hasOne(models.EstablishmentCategories, {
      foreignKey: 'id'
    })
  };
  return Establishment;
};