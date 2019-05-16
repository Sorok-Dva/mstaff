'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserPool = sequelize.define('UserPool', {
    pool_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    availability: DataTypes.JSON,
    establishment: DataTypes.INTEGER,
    service: DataTypes.INTEGER,
    available: DataTypes.BOOLEAN,
    month_experience: DataTypes.INTEGER,
  }, {});
  UserPool.associate = function (models) {
    UserPool.belongsTo(models.Pool, {
      foreignKey: 'id',
      as: 'pool',
      onDelete: 'CASCADE'
    });
    UserPool.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    UserPool.belongsTo(models.Establishment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    UserPool.belongsTo(models.Service, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return UserPool;
};