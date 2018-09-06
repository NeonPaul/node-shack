const exporess = require('express');
const sql = require('sql-tag');

const pool = require('../db');

const route = new exporess.Router();
const nested = opts => { opts.nestTables = true; return opts; }

const fetchPosts = async () => {
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

  return posts.map(({ posts: post, users: author }) => ({
    ...post,
    author
  }));
}

route.get('/',  async (req, res, next) => {
  try {
    res.state.posts = await fetchPosts();
    req.found = true;

    next();
  } catch(e) {
    next(e);
  }
});

route.post('/',  async (req, res, next) => {
  try {
    await pool.query(
      sql`
        INSERT INTO posts ( content, user_id, bitchingabout ) VALUES (${req.body.content}, ${req.user.id}, 0);
      `
    );

    res.state.posts = await fetchPosts();
    req.found = true;
    res.location('/');

    next();
  } catch(e) {
    next(e);
  }
});

module.exports = route;
