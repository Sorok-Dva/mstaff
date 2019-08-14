'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pool = sequelize.define('Pool', {
    name: DataTypes.STRING,
    user_id: DataTypes.STRING,
    es_id: DataTypes.INTEGER,
  }, {});
  Pool.associate = function (models) {
    Pool.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    Pool.belongsTo(models.Establishment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Pool;
};