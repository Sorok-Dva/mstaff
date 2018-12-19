'use strict';
module.exports = (sequelize, DataTypes) => {
  const Demo = sequelize.define('Demo', {
    email: DataTypes.STRING,
    type: DataTypes.STRING,
    phone: DataTypes.STRING,
    es_name: DataTypes.STRING,
    done: DataTypes.BOOLEAN
  }, {});
  Demo.associate = function (models) {
    Demo.belongsTo(models.Establishment, {
      foreignKey: 'name',
      onDelete: 'CASCADE'
    });
    Demo.belongsTo(models.User, {
      foreignKey: 'email',
      onDelete: 'CASCADE'
    })
  };
  return Demo;
};