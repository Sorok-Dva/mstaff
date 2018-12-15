'use strict';
module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    es_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    photo: DataTypes.STRING,
    video: DataTypes.STRING,
    status: DataTypes.STRING,
    note: DataTypes.STRING,
    views: DataTypes.INTEGER
  }, {});
  Candidate.associate = (models) => {
    Candidate.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Candidate;
};