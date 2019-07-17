'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPool = sequelize.define('UserPool', {
    pool_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    availability: DataTypes.JSON,
    service: DataTypes.JSON,
    post: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
    month_experience: DataTypes.INTEGER,
  }, {});
  UserPool.associate = function (models) {
    UserPool.belongsTo(models.Pool, {
      foreignKey: 'pool_id',
      targetKey: 'id',
      onDelete: 'CASCADE',
      as: 'pool',
    });
    UserPool.belongsTo(models.User, {
      foreignKey: 'user_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };


  return UserPool;
};