'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupsSuperGroup = sequelize.define('GroupsSuperGroups', {
    id_group: DataTypes.INTEGER,
    id_super_group: DataTypes.INTEGER
  }, {});
  GroupsSuperGroup.associate = function (models) {
    GroupsSuperGroup.belongsTo(models.Groups, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    GroupsSuperGroup.belongsTo(models.SuperGroups, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return GroupsSuperGroup;
};