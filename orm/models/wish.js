'use strict';
module.exports = (sequelize, DataTypes) => {
  const Wish = sequelize.define('Wish', {
    candidate_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    contract_type: {
      type: DataTypes.ENUM,
      values: ['internship', 'CDI', 'CDD', 'CP', 'CL', 'AL', 'RCL', 'RL']
    },
    posts: {
      type: DataTypes.JSON,
      get() {
        if (this.getDataValue('posts') === null)
          return [];
        else {
          let data = JSON.parse(this.getDataValue('posts'));
          if (typeof data === 'string') return [data];
          else return data;
        }
      },
      set(data) {
        if (data === null)
          this.setDataValue('posts', data);
        else
          this.setDataValue('posts', JSON.stringify(data));
      }
    },
    services: {
      type: DataTypes.JSON,
      get() {
        if (this.getDataValue('services') === null)
          return [];
        else {
          let data = JSON.parse(this.getDataValue('services'));
          if (typeof data === 'string') return [data];
          else return data;
        }
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
    es_count: DataTypes.INTEGER,
    renewed_date: DataTypes.DATE
  }, {});
  Wish.associate = function (models) {
    Wish.hasOne(models.Candidate, {
      foreignKey: 'id',
      sourceKey: 'candidate_id',
      onDelete: 'CASCADE'
    });
    Wish.hasMany(models.Application, {
      foreignKey: 'wish_id',
      sourceKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Wish;
};