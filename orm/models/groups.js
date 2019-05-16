'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Groups', {
    name: DataTypes.STRING,
    banner: DataTypes.STRING,
    logo: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {});
  Group.associate = function (models) {
    Group.hasMany(models.Establishment, {
      foreignKey: 'id',
      as: 'es'
    });
  };
  return Group;
};