const exporess = require('express');
const sql = require('sql-tag');

const pool = require('../db');

const route = new exporess.Router();
const nested = opts => { opts.nestTables = true; return opts; }

route.get('/',  async (req, res, next) => {
  try {
    const postRelations = [
      "author",
      "reactions",
      "reactions.user",
      "reactions.type"
    ];

    const [ posts ] = await pool.query(
      nested(sql`
      SELECT users.user, users.avatar,
            posts.content, posts.id, posts.time, posts.user_id
      FROM posts
      LEFT JOIN users ON (users.id = posts.user_id)
      ORDER BY time DESC
      LIMIT 50`)
    );

    // INNER JOIN response ON (response.post_id = posts.id)
    // INNER JOIN response_type ON (response_type.id = response.response_type_id)

    if (!posts || !posts[0]) {
      throw new Error(`No posts found`);
    }

    req.found = true;

    res.state.posts = posts.map(({ posts: post, users: author }) => ({
      ...post,
      author
    }));

    next();
  } catch(e) {
    next(e);
  }
});

module.exports = route;
