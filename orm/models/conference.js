'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conference = sequelize.define('Conference', {
    es_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    candidate_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    status: DataTypes.STRING
  }, {});
  Conference.associate = function (models) {
    // associations can be defined here
  };
  return Conference;
};