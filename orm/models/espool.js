'use strict';
module.exports = (sequelize, DataTypes) => {
  const EsPool = sequelize.define('EsPool', {
    name: DataTypes.STRING,
    pool_id: DataTypes.INTEGER,
    es_id: DataTypes.INTEGER
  }, {});
  EsPool.associate = function (models) {
    EsPool.belongsTo(models.Pool, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    EsPool.belongsTo(models.Establishment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    })
  };
  return EsPool;
};