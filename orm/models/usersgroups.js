'use strict';
module.exports = (sequelize, DataTypes) => {
  const UsersGroups = sequelize.define('UsersGroups', {
    user_id: DataTypes.INTEGER,
    supergroup_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    es_id: DataTypes.INTEGER,
    role: DataTypes.STRING,
    last_use: DataTypes.DATE
  }, {});
  UsersGroups.associate = function (models) {
    UsersGroups.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });

    UsersGroups.belongsTo(models.Groups, {
      foreignKey: 'group_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });

    UsersGroups.belongsTo(models.SuperGroups, {
      foreignKey: 'supergroup_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });

    UsersGroups.belongsTo(models.Establishment, {
      foreignKey: 'es_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return UsersGroups;
};