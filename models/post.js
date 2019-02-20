'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Post.associate = function (models) {
    Post.belongsTo(models.Experience, {
      foreignKey: 'id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    Post.belongsTo(models.CategoriesPostsServices, {
      foreignKey: 'categoriesPS_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return Post;
};