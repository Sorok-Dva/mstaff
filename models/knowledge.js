'use strict';
module.exports = (sequelize, DataTypes) => {
  const Knowledge = sequelize.define('Knowledge', {
    name: DataTypes.STRING
  }, {});
  Knowledge.associate = function(models) {
    Knowledge.belongsTo(models.CandidateKnowledge, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Knowledge;
};