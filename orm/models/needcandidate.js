'use strict';
module.exports = (sequelize, DataTypes) => {
  const NeedCandidate = sequelize.define('NeedCandidate', {
    need_id: DataTypes.INTEGER,
    candidate_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    notified: DataTypes.BOOLEAN
  }, {});
  NeedCandidate.associate = function (models) {
    NeedCandidate.hasOne(models.Candidate, {
      foreignKey: 'id',
      sourceKey: 'candidate_id',
      onDelete: 'CASCADE'
    });
    NeedCandidate.belongsTo(models.Need, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    })
  };
  return NeedCandidate;
};