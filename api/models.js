var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : 'shack',
    charset  : 'utf8mb4'
  }
});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users'
});


module.exports = {
  User
};
