'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subdomain = sequelize.define('Subdomain', {
    name: DataTypes.STRING,
    enable: DataTypes.BOOLEAN,
    es_id: DataTypes.INTEGER,
    group_id: DataTypes.STRING,
    super_group_id: DataTypes.INTEGER
  }, {});
  Subdomain.associate = (models) => {
    Subdomain.hasOne(models.Groups, {
      foreignKey: 'id',
      sourceKey: 'group_id'
    });
    Subdomain.hasOne(models.SuperGroups, {
      foreignKey: 'id',
      sourceKey: 'super_group_id'
    });
    Subdomain.hasOne(models.Establishment, {
      foreignKey: 'id',
      sourceKey: 'es_id'
    })
  };
  return Subdomain;
};