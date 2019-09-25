'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Establishments', 'type', 'type_id')
      .then(() => {
        return queryInterface.createTable('EstablishmentTypes', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          name: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING
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
        })
      })
      .then(() => {
        return queryInterface.changeColumn('Establishments', 'type_id', {
          type: Sequelize.INTEGER
        })
      })
      .then(() => {
        return queryInterface.changeColumn('Establishments', 'type_id', {
          type: Sequelize.INTEGER,
          references: {
            model: 'EstablishmentTypes',
            key: 'id',
          },
          onUpdate: 'CASCADE'
        })
      })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.getForeignKeyReferencesForTable('Establishments')
      .then((fks) => {
        let fk_name = null;
        for (let i = 0; i < fks.length; i++){
          const fk = fks[i];
          if (fk.tableName === 'Establishments' && fk.columnName === 'type_id' && fk.referencedTableName === 'EstablishmentTypes' && fk.referencedColumnName === 'id')
            fk_name = fk.constraint_name;
        }
        if (!fk_name)
          return;
        return queryInterface.removeConstraint('Establishments', fk_name)
      })
      .then(() => {
        return queryInterface.removeIndex('Establishments', 'type_id')
      })
      .then(() => {
        return queryInterface.changeColumn('Establishments', 'type_id', {
          type: Sequelize.STRING
        })
      })
      .then(() => {
        return queryInterface.renameColumn('Establishments', 'type_id', 'type')
      })
      .then(() => {
        return queryInterface.dropTable('EstablishmentTypes');
      })
  }
};