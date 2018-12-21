'use strict';
module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define('Experience', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    candidate_id: DataTypes.INTEGER,
    poste_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    internship: DataTypes.BOOLEAN,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    current: DataTypes.BOOLEAN
  }, {});
  Experience.associate = function(models) {
    Experience.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Experience;
};