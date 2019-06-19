'use strict';
module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define('Offer', {
    name: DataTypes.STRING,
    createdBy: DataTypes.INTEGER,
    es_id: DataTypes.INTEGER,
    need_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    nature_section: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('nature_section'))
      },
      set(data) {
        this.setDataValue('nature_section', JSON.stringify(data));
      }
    },
    context_section: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('context_section'))
      },
      set(data) {
        this.setDataValue('context_section', JSON.stringify(data));
      }
    },
    details_section: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('details_section'))
      },
      set(data) {
        this.setDataValue('details_section', JSON.stringify(data));
      }
    },
    postDescription_section: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('postDescription_section'))
      },
      set(data) {
        this.setDataValue('postDescription_section', JSON.stringify(data));
      }
    },
    prerequisites_section: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('prerequisites_section'))
      },
      set(data) {
        this.setDataValue('prerequisites_section', JSON.stringify(data));
      }
    },
    terms_sections: {
      type: DataTypes.JSON,
      get() {
        return JSON.parse(this.getDataValue('terms_sections'))
      },
      set(data) {
        this.setDataValue('terms_sections', JSON.stringify(data));
      }
    },
  }, {});
  Offer.associate = (models) => {
    // associations can be defined here
  };
  return Offer;
};