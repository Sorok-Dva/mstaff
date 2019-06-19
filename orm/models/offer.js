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
        let nature_section = this.getDataValue('nature_section') === undefined ? '{}' : this.getDataValue('nature_section');
        return JSON.parse(nature_section);
      },
      set(data) {
        this.setDataValue('nature_section', JSON.stringify(data));
      }
    },
    context_section: {
      type: DataTypes.JSON,
      get() {
        let context_section = this.getDataValue('context_section') === undefined ? '{}' : this.getDataValue('context_section');
        return JSON.parse(context_section);
      },
      set(data) {
        this.setDataValue('context_section', JSON.stringify(data));
      }
    },
    details_section: {
      type: DataTypes.JSON,
      get() {
        let details_section = this.getDataValue('details_section') === undefined ? '{}' : this.getDataValue('details_section');
        return JSON.parse(details_section);
      },
      set(data) {
        this.setDataValue('details_section', JSON.stringify(data));
      }
    },
    postDescription_section: {
      type: DataTypes.JSON,
      get() {
        let postDescription_section = this.getDataValue('postDescription_section') === undefined ? '{}'
          : this.getDataValue('postDescription_section');
        return JSON.parse(postDescription_section);
      },
      set(data) {
        this.setDataValue('postDescription_section', JSON.stringify(data));
      }
    },
    prerequisites_section: {
      type: DataTypes.JSON,
      get() {
        let prerequisites_section = this.getDataValue('prerequisites_section') === undefined ? '{}'
          : this.getDataValue('prerequisites_section');
        return JSON.parse(prerequisites_section);
      },
      set(data) {
        this.setDataValue('prerequisites_section', JSON.stringify(data));
      }
    },
    terms_sections: {
      type: DataTypes.JSON,
      get() {
        let terms_sections = this.getDataValue('terms_sections') === undefined ? '{}' : this.getDataValue('terms_sections');
        return JSON.parse(terms_sections);
      },
      set(data) {
        this.setDataValue('terms_sections', JSON.stringify(data));
      }
    },
  }, {});
  Offer.associate = (models) => {
    Offer.hasOne(models.Establishment, {
      foreignKey: 'id',
      sourceKey: 'es_id',
      onDelete: 'CASCADE'
    });
    Offer.hasOne(models.User, {
      foreignKey: 'id',
      sourceKey: 'createdBy'
    });
    Offer.hasOne(models.Need, {
      foreignKey: 'need_id',
      as: 'need'
    });
  };
  return Offer;
};