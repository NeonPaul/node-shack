const exporess = require('express');
const sql = require('sql-tag');

const pool = require('../db');
const { webpush } = require('../push');

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

    // Notifications
    const [ channels ] = await pool.query(
      sql`SELECT data, id FROM channels WHERE channels.user_id != ${ req.user.id }`
    );

    const payload = "{}";
    const remove = [];

    for(const { data, id } of channels) {
      try {
        const parsed = JSON.parse(data);
        if(!parsed.endpoint) {
          remove.push(id);
          continue;
        }
        await webpush.sendNotification(parsed, payload);
      } catch(e) {
        if(e.statusCode === 410) {
          remove.push(id);
        } else {
          console.log(data);
          console.log(e);
        }
      }
    }

    if(remove.length) {
      await pool.query(sql `DELETE FROM channels WHERE id IN (${remove})`);
    }
  } catch(e) {
    next(e);
  }
});

module.exports = route;
