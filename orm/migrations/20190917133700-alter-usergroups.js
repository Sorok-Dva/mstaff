'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    const __ = process.cwd();
    const { Op } = Sequelize;
    const Models = require(`${__}/orm/models/index`);

    return queryInterface.sequelize.transaction({ autocommit: false }).then(async (t) => {
      let usersGroupsTable = [];

      await Models.UsersGroups.findAll({
        attributes: ['user_id', 'id_group', 'role']
      }).then(usersgroups => {
        usersgroups.forEach((element) => {
          usersGroupsTable.push({ user_id: element.user_id, es_id: null, supergroup_id: null, group_id: element.id_group, role: element.role });
        });
      });

      await Models.UsersSuperGroups.findAll({
        attributes: ['user_id', 'id_supergroup', 'role']
      }).then(usersupergroups => {
        usersupergroups.forEach((element) => {
          usersGroupsTable.push({ user_id: element.user_id, es_id: null, supergroup_id: element.id_supergroup, group_id: null, role: element.role });
        });
      });

      await Models.ESAccount.findAll({
        attributes: ['user_id', 'es_id', 'role'],
      }).then(es => {
        es.forEach((element) => {
          usersGroupsTable.push({ user_id: element.user_id, group_id: null, supergroup_id: null, es_id: element.es_id, role: element.role });
        });
      });

      return queryInterface.dropTable('UsersGroups2', { transaction: t }).then(() => {
        return queryInterface.createTable('UsersGroups2', {
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
          group_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'Groups',
              key: 'id'
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
          es_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'Establishments',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: true
          },
          role: {
            type: Sequelize.STRING,
            defaultValue: 'User'
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
          },
        }, { transaction: t }).then(()=> {
          return queryInterface.bulkInsert('UsersGroups2', usersGroupsTable, { transaction: t });
        });
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UsersGroups2');
  }
};

/*await queryInterface.sequelize.query(`CREATE TABLE UsersGroups2(
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  supergroup_id INT DEFAULT NULL,
  group_id INT DEFAULT NULL,
  es_id INT NOT NULL,
  role ENUM('test', 'test2') NOT NULL DEFAULT 'test',
  last_use DATETIME DEFAULT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (supergroup_id) REFERENCES SuperGroups(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES Groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (es_id) REFERENCES Establishments(ide) ON UPDATE CASCADE ON DELETE CASCADE
  )`, { transaction });*/