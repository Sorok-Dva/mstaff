'use strict';
module.exports = (sequelize, DataTypes) => {
  const ESAccount = sequelize.define('ESAccount', {
    user_id: DataTypes.INTEGER,
    es_id: DataTypes.INTEGER,
    role: DataTypes.STRING,
    last_use: DataTypes.DATE
  }, {});
  ESAccount.associate = function (models) {
    ESAccount.belongsTo(models.User, {
      foreignKey: 'id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
    ESAccount.belongsTo(models.Establishment, {
      foreignKey: 'es_id',
      targetKey: 'id',
      onDelete: 'CASCADE'
    });
  };
  return ESAccount;
};