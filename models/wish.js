'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wish = sequelize.define('Wish', {
    candidate_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    contract_type: DataTypes.STRING,
    full_time: DataTypes.BOOLEAN,
    part_time: DataTypes.BOOLEAN,
    day_time: DataTypes.BOOLEAN,
    night_time: DataTypes.BOOLEAN,
    liberal_cabinets: DataTypes.BOOLEAN,
    availability: DataTypes.JSON,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    status: DataTypes.STRING,
    lat: DataTypes.STRING,
    lon: DataTypes.STRING,
    geolocation: DataTypes.BOOLEAN,
    custom_address: DataTypes.TEXT,
    es_count: DataTypes.INTEGER
  }, {});
  Wish.associate = function (models) {
    Wish.belongsTo(models.Candidate, {
      foreignKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Wish;
};