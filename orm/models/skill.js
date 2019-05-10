'use strict';
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Skill.associate = function (models) {
    Skill.belongsTo(models.CandidateSkill, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Skill;
};