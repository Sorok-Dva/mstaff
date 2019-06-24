'use strict';
module.exports = (sequelize, DataTypes) => {
  const UsersSuperGroups = sequelize.define('UsersSuperGroups', {
    user_id: DataTypes.INTEGER,
    id_supergroup: DataTypes.INTEGER,
    role: DataTypes.TEXT
  }, {});
  UsersSuperGroups.associate = function (models) {
    UsersSuperGroups.associate = function (models) {
      UsersSuperGroups.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id',
        onDelete: 'CASCADE'
      });

      UsersSuperGroups.belongsTo(models.SuperGroups, {
        foreignKey: 'id_supergroup',
        targetKey: 'id',
        onDelete: 'CASCADE'
      });
    };
  };
  return UsersSuperGroups;
};