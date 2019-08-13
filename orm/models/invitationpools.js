'use strict';
module.exports = (sequelize, DataTypes) => {
  const InvitationPools = sequelize.define('InvitationPools', {
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    pool_id: DataTypes.INTEGER
  }, {});
  InvitationPools.associate = function (models) {
    InvitationPools.belongsTo(models.Pool, {
      foreignKey: 'id',
      as: 'pool',
      onDelete: 'CASCADE'
    });
  };
  return InvitationPools;
};