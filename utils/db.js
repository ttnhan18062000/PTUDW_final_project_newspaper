const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '34.126.188.224',
    user: 'root',
    password: '123456',
    database: 'dbnews',
    port: 3306
  },
  pool: {
    min: 0,
    max: 50
  }
});

module.exports = knex;

// gcp sql instance password: 9ubdzMLMEksbqA8h