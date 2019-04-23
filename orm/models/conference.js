'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conference = sequelize.define('Conference', {
    es_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    need_id: DataTypes.INTEGER,
    candidate_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    date: DataTypes.DATE,
    status: DataTypes.STRING,
    key: DataTypes.STRING
  }, {});
  Conference.associate = function (models) {
    Conference.hasOne(models.Candidate, {
      foreignKey: 'id',
      sourceKey: 'candidate_id'
    })
  };
  return Conference;
};