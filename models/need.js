'use strict';
module.exports = (sequelize, DataTypes) => {
  const Need = sequelize.define('Need', {
    name: DataTypes.STRING,
    es_id: DataTypes.INTEGER,
    post: DataTypes.STRING,
    contract_type: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE
  }, {});
  Need.associate = function (models) {
    // associations can be defined here
  };
  return Need;
};