'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    name: DataTypes.STRING,
  }, {});
  Group.associate = function (models) {
    Group.hasMany(models.Establishment, {
      foreignKey: 'group_id',
    })
  };
  return Group;
};