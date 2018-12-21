'use strict';
module.exports = (sequelize, DataTypes) => {
  const Software = sequelize.define('Software', {
    name: DataTypes.STRING
  }, {});
  Software.associate = function(models) {
    Software.belongsTo(models.CandidateSoftware, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Software;
};