'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Service.associate = function (models) {
    Service.belongsTo(models.Experience, {
      foreignKey: 'id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    Service.belongsTo(models.CategoriesPostsServices, {
      foreignKey: 'categoriesPS_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Service;
=======
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoriesPS_id: {
      type: DataTypes.INTEGER
    }
  }, {});
  Service.associate = function (models) {
    Service.belongsTo(models.Experience, {
      foreignKey: 'id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    Service.belongsTo(models.CategoriesPostsServices, {
      foreignKey: 'categoriesPS_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Service;
};