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
    software_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Softwares',
        key: 'id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    },
    start: DataTypes.DATE,
    end: DataTypes.DATE
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