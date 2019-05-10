'use strict';
module.exports = (sequelize, DataTypes) => {
  const ConfigSkill = sequelize.define('ConfigSkills', {
    id_skill: DataTypes.INTEGER,
    id_post: DataTypes.INTEGER,
    id_service: DataTypes.INTEGER
  }, {});
  ConfigSkill.associate = function (models) {
    ConfigSkill.belongsTo(models.Skill, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    ConfigSkill.belongsTo(models.Post, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    ConfigSkill.belongsTo(models.Service, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return ConfigSkill;
};