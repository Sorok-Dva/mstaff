'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Groups', {
    name: DataTypes.STRING,
    banner: DataTypes.STRING,
    logo: DataTypes.STRING,
    domain_name: DataTypes.STRING,
    domain_enable: DataTypes.BOOLEAN,
  }, {});
  Group.associate = function (models) {
    Group.hasMany(models.EstablishmentGroups, {
      foreignKey: 'id_group',
      sourceKey: 'id',
      onDelete: 'CASCADE'
    });
    Group.hasMany(models.Establishment, {
      sourceKey: 'id',
    })
  };
  return Group;
};