const webpush = require("./push");
const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "password",
    database: process.env.DB_NAME || "shack",
    charset: "utf8mb4"
  }
});

const bookshelf = require("bookshelf")(knex);
bookshelf.plugin("visibility");
bookshelf.plugin("pagination");

const User = bookshelf.Model.extend({
  tableName: "users",
  hidden: [
    "password",
    "passwd",
    "auth_type",
    "money",
    "u_status",
    "profile",
    "status",
    "login"
  ]
});

const Post = bookshelf.Model.extend({
  tableName: "posts",
  author: function() {
    return this.belongsTo(User);
  },
  reactions: function() {
    return this.hasMany(Reaction);
  }
});

const Reaction = bookshelf.Model.extend({
  tableName: "response",
  type: function() {
    return this.belongsTo(ReactionType, "response_type_id");
  },
  post: function() {
    return this.belongsTo(Post);
  },
  user: function() {
    return this.belongsTo(User);
  }
});

const ReactionType = bookshelf.Model.extend({
  tableName: "response_type"
});

const Subscription = bookshelf.Model.extend({
  tableName: "subscriptions",
  user: function() {
    return this.belongsTo(User);
  }
});

const Channel = bookshelf.Model.extend({
  tableName: "channels",
  user: function() {
    return this.belongsTo(User);
  },
  push: function(payload) {
    return webpush.sendNotification(JSON.parse(this.get("data")), payload);
  }
});

module.exports = { User, Post, ReactionType, Reaction, Subscription, Channel };
