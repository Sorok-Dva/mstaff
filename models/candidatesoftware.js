'use strict';
module.exports = (sequelize, DataTypes) => {
  const CandidateSoftware = sequelize.define('CandidateSoftware', {
    candidate_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Candidate',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      allowNull: false
    },
    name: DataTypes.STRING,
    stars: DataTypes.INTEGER
  }, {});
  CandidateSoftware.associate = function (models) {
    CandidateSoftware.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
    CandidateSoftware.hasOne(models.Software, {
      foreignKey: 'id',
      as: 'software'
    });
  };
  return CandidateSoftware;
};