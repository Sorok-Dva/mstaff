'use strict';
module.exports = (sequelize, DataTypes) => {
  const ConfigEquipment = sequelize.define('ConfigEquipments', {
    id_equipment: DataTypes.INTEGER,
    id_post: DataTypes.INTEGER,
    id_service: DataTypes.INTEGER
  }, {});
  ConfigEquipment.associate = function (models) {
    ConfigEquipment.belongsTo(models.Equipment, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    ConfigEquipment.belongsTo(models.Post, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    ConfigEquipment.belongsTo(models.Service, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return ConfigEquipment;
};