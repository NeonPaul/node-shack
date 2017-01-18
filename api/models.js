var webpush = require('./push')

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : 'shack',
    charset  : 'utf8mb4'
  }
})

var bookshelf = require('bookshelf')(knex)
bookshelf.plugin('visibility')
bookshelf.plugin(require('bookshelf-jsonapi-params'))

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
})

var Post = bookshelf.Model.extend({
  tableName: 'posts',
  author: function () {
    return this.belongsTo(User)
  }
})

var Subscription = bookshelf.Model.extend({
  tableName: 'subscriptions',
  user: function () {
    return this.belongsTo(User)
  }
})

var Channel = bookshelf.Model.extend({
  tableName: 'channels',
  user: function () {
    return this.belongsTo(User)
  },
  push: function (payload) {
    webpush.sendNotification(JSON.parse(this.get('data')), payload)
  }
})

module.exports = {
  User,
  Post,
  Subscription,
  Channel
}
