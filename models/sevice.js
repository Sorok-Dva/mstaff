'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Service.associate = function (models) {
    Service.belongsTo(models.Experience, {
      foreignKey: 'id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Service;
};