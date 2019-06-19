'use strict';
module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    name: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    es_id: DataTypes.INTEGER,
    need_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    nature_section: DataTypes.JSON,
    context_section: DataTypes.JSON,
    details_section: DataTypes.JSON,
    postDescription_section: DataTypes.JSON,
    prerequisites_section: DataTypes.JSON,
    terms_sections: DataTypes.JSON,
  }, {});
  Offer.associate = (models) => {
    // associations can be defined here
  };
  return Offer;
};