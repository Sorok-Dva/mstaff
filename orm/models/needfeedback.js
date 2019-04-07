'use strict';
module.exports = (sequelize, DataTypes) => {
  const NeedFeedback = sequelize.define('NeedFeedback', {
    es_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    need_id: DataTypes.INTEGER,
    how: DataTypes.STRING,
    candidates: DataTypes.JSON,
    stars: DataTypes.INTEGER,
    feedback: DataTypes.STRING
  }, {});
  NeedFeedback.associate = function(models) {
    // associations can be defined here
  };
  return NeedFeedback;
};