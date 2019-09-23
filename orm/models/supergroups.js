'use strict';
module.exports = (sequelize, DataTypes) => {
  const SuperGroup = sequelize.define('SuperGroups', {
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    banner: DataTypes.STRING,
    domain_name: DataTypes.STRING,
    domain_enable: DataTypes.BOOLEAN,
  }, {});
  SuperGroup.associate = function (models) {
    SuperGroup.hasMany(models.GroupsSuperGroups, {
      foreignKey: 'id_super_group',
      sourceKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return SuperGroup;
};