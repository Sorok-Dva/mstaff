'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wish = sequelize.define('Wish', {
    candidate_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    contract_type: DataTypes.STRING,
    posts: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('posts'))
      },
      set(data) {
        this.setDataValue('posts', JSON.stringify(data));
      }
    },
    services: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('services'))
      },
      set(data) {
        if (data === null)
          this.setDataValue('services', data);
        else
          this.setDataValue('services', JSON.stringify(data));
      }
    },
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
    Wish.hasOne(models.Candidate, {
      foreignKey: 'id',
      sourceKey: 'candidate_id',
      onDelete: 'CASCADE'
    });
  };
  return Wish;
};