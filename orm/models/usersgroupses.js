'use strict';
module.exports = (sequelize, DataTypes) => {
  const UsersGroupsEs = sequelize.define('UsersGroupsEs', {
    user_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    es_id: DataTypes.INTEGER
  }, {});
  UsersGroupsEs.associate = function (models) {
    UsersGroupsEs.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });

    UsersGroupsEs.belongsTo(models.Groups, {
      foreignKey: 'group_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });

    UsersGroupsEs.belongsTo(models.Establishment, {
      foreignKey: 'es_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return UsersGroupsEs;
};