'use strict';
module.exports = (sequelize, DataTypes) => {
  const UsersGroups = sequelize.define('UsersGroups', {
    user_id: DataTypes.INTEGER,
    id_group: DataTypes.INTEGER,
    role: DataTypes.STRING
  }, {});
  UsersGroups.associate = function (models) {
    UsersGroups.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });

    UsersGroups.belongsTo(models.Groups, {
      foreignKey: 'id_group',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return UsersGroups;
};