const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: 'shack',
    charset: 'utf8mb4'
  }
})

const bookshelf = require('bookshelf')(knex)
bookshelf.plugin('visibility')

const User = bookshelf.Model.extend({
  tableName: 'users',
  hidden: [
    'password',
    'passwd',
    'auth_type',
    'money',
    'u_status',
    'profile',
    'status',
    'login'
  ]
})

module.exports = { User }
