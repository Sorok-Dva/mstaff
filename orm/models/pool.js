'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pool = sequelize.define('Pool', {
    name: DataTypes.STRING,
    referent: DataTypes.STRING,
    owner: DataTypes.STRING,
    group_mode: DataTypes.BOOLEAN
  }, {});
  Pool.associate = function (models) {
    Pool.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Pool;
};