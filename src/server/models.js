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
bookshelf.plugin('pagination')

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

var Post = bookshelf.Model.extend({
  tableName: 'posts',
  author: function () {
    return this.belongsTo(User)
  },
  reactions: function () {
    return this.hasMany(Reaction)
  }
})

var Reaction = bookshelf.Model.extend({
  tableName: 'response',
  type: function () {
    return this.belongsTo(ReactionType, 'response_type_id')
  },
  post: function () {
    return this.belongsTo(Post)
  },
  user: function () {
    return this.belongsTo(User)
  }
})

var ReactionType = bookshelf.Model.extend({
  tableName: 'response_type'
})

module.exports = { User, Post }
