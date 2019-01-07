'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    name:  {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Post.associate = function (models) {
    Post.belongsTo(models.Experience, {
      foreignKey: 'id',
      fieldName: 'service_id',
      onDelete: 'CASCADE'
    });
  };
  return Post;
};