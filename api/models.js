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
bookshelf.plugin('pagination');
bookshelf.plugin('visibility')

var User = bookshelf.Model.extend({
  tableName: 'users',
  hidden: ['password',
           'passwd',
           'auth_type',
           'money',
           'u_status',
           'profile',
           'status',
           'login']
});

var Post = bookshelf.Model.extend({
  tableName: 'posts'
});

module.exports = {
  User,
  Post
};
