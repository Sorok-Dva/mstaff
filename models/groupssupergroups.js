'use strict';
module.exports = (sequelize, DataTypes) => {
  const GroupSuperGroup = sequelize.define('GroupSuperGroups', {
    name: DataTypes.STRING,
  }, {});
  GroupSuperGroup.associate = function (models) {
    GroupSuperGroup.belongsTo(models.Groups, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    GroupSuperGroup.belongsTo(models.SuperGroups, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return GroupSuperGroup;
};