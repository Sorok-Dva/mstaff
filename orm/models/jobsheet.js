'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobSheet = sequelize.define('JobSheet', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    activities: DataTypes.TEXT,
    knowHow: DataTypes.TEXT,
    knowledge: DataTypes.TEXT,
    infos: DataTypes.TEXT
  }, {});
  JobSheet.associate = (models) => {
    // associations can be defined here
  };
  return JobSheet;
};