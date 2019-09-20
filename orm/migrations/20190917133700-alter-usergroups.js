'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const __ = process.cwd();
    const Models = require(`${__}/orm/models/index`);

    let UsersGroupsTable = [];

    let query = 'SELECT A.user_id, A.id_group, A.role, B.id_es FROM UsersGroups A INNER JOIN EstablishmentGroups B ON A.id_group = B.id_group';
    await queryInterface.sequelize.query(query).then((usersGroup) => {
      usersGroup[0].forEach(element => {
        UsersGroupsTable.push({ user_id: element.user_id,  supergroup_id: null, group_id: element.id_group, es_id: element.id_es, role: element.role });
      });
    });

    await Models.UsersSuperGroups.findAll({
      attributes: ['user_id', 'id_supergroup', 'role'],
      include: [{
        model: Models.SuperGroups,
        required: true,
        include: [{
          attributes: ['id_group'],
          model: Models.GroupsSuperGroups,
          required: true,
          include: [{
            model: Models.Groups,
            required: true,
            include: [{
              model: Models.EstablishmentGroups,
              required: true,
            }]
          }]
        }]
      }],
    }).then((usersSuperGroup) => {
      usersSuperGroup.forEach(element => {
        element.SuperGroup.GroupsSuperGroups.forEach(element2 => {
          element2.Group.EstablishmentGroups.forEach(element3 => {
            UsersGroupsTable.push({ user_id: element.user_id, supergroup_id: element.id_supergroup, group_id: element2.id_group, es_id: element3.id_es, role: element.role });
          });
        });
      });
    });

    await Models.ESAccount.findAll({
      attributes: ['user_id', 'es_id']
    }).then((esAccounts) => {
      esAccounts.forEach(element => {
        UsersGroupsTable.push({ user_id: element.user_id, supergroup_id: null, group_id: null, es_id: element.es_id, role: 'Admin' });
      })
    });

    return queryInterface.dropTable('UsersGroups').then(() => {
      return queryInterface.createTable('UsersGroups', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        supergroup_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'SuperGroups',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        group_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Groups',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        es_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Establishments',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false
        },
        role: {
          type: Sequelize.STRING,
          defaultValue: 'User'
        },
        last_use: {
          type: Sequelize.DATE
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }).then(() => {
        return Models.UsersGroups.bulkCreate(UsersGroupsTable).then(() => {
          return queryInterface.dropTable('ESAccounts').then(() => {
            return queryInterface.dropTable('UsersSuperGroups').then(() => {});
          });
        });
      });
    });
  }
};