'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Groups', {
    name: DataTypes.STRING,
    banner: DataTypes.STRING,
    logo: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {});
  Group.associate = function (models) {
    Group.hasMany(models.EstablishmentGroups, {
      foreignKey: 'id_group',
      sourceKey: 'id',
      onDelete: 'CASCADE'
    })
  };
  return Group;
};