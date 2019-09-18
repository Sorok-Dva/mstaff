let knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '91.121.79.166',
    user: 'mstaff',
    password: '=G3WRPs@qqzZwCJB',
    database: 'mstaff_test'
  }
});

let sql = '' +
  'ALTER TABLE Establishments ADD COLUMN primary_group_id INT,' +
  'ADD CONSTRAINT fk_primary_group_id FOREIGN KEY(primary_group_id) REFERENCES Groups(id) ON DELETE SET NULL ON UPDATE CASCADE;';

//sql = 'START TRANSACTION;' + sql + 'COMMIT;';

knex.raw('START TRANSACTION;').then( () => {
  return knex.raw(sql).then( () => {
    return knex.raw('COMMIT;').then( () => {
      console.log('COMMITED !');
    });
  });
})
  .catch(() => {
    return knex.raw('ROLLBACK;')
      .then(() => {
        console.log('ROLLBACKED !');
      });
  });