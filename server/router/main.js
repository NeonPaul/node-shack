const exporess = require('express');
const sql = require('sql-tag');
const getenv = require('getenv');
const BASE_URL = getenv('BASE_URL', 'http://localhost:3000')

const pool = require('../db');
const { webpush } = require('../push');
const mail = require('../mail');

const route = new exporess.Router();
const nested = opts => { opts.nestTables = true; return opts; }

const fetchPosts = async () => {
  const [ posts ] = await pool.query(
    nested(sql`
    SELECT users.user, users.avatar,
          posts.content, posts.id, posts.time, posts.user_id,
          response_type.verb, response_type.context, response_type.icon,
          responder.user
    FROM posts
    LEFT JOIN users ON (users.id = posts.user_id)
    LEFT JOIN response ON (response.post_id = posts.id)
    LEFT JOIN response_type ON (response_type.id = response.response_type_id)
    LEFT JOIN users AS responder ON (responder.id = response.user_id)
    ORDER BY time DESC
    LIMIT 50`)
  );

  if (!posts || !posts[0]) {
    throw new Error(`No posts found`);
  }

  let id = null;
  let currentPost = null;
  const mappedPosts = [];

  for (const record of posts) {
    const { posts: post, users: author, responder, response_type } = record;
    if(post.id !== id) {
      id = post.id;
      currentPost = {
        ...post,
        author,
        reactions: []
      };
      mappedPosts.push(currentPost);
    }

    if(response_type.verb) {
      currentPost.reactions.push({
        user: responder.user,
        context: response_type.context,
        icon: response_type.icon
      });
    }
  }

  return mappedPosts;
}

route.get('/',  async (req, res, next) => {
  try {
    res.state.posts = await fetchPosts();
    res.state.reactionTypes = (await pool.query(sql`SELECT * FROM response_type;`))[0];
    res.state.editingId = req.query.edit || null;
    req.found = true;

    next();
  } catch(e) {
    next(e);
  }
});

route.post('/:id/react', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    // TODO: CHeck post exists, reaction type exists
    const reactionType = req.body.reactionType;

    await pool.query(sql`INSERT INTO response (response_type_id, user_id, post_id)
    VALUES(${reactionType}, ${userId}, ${postId})`);

    req.found = true;
    res.location('/');

    next();
  } catch(e) {
    next(e);
  }
})

route.post('/:id/edit', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const content = req.body.content;

    await pool.query(sql`UPDATE posts SET content=${content} WHERE posts.id=${postId} AND posts.user_id=${userId}`);

    req.found = true;
    res.location('/');

    next();
  } catch(e) {
    next(e);
  }
})

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

    const mentions = (req.body.content.match(/\B@[a-z0-9_]+/ig) || []).map(s => s.substr(1));

    const [ users ] = await pool.query(sql`
      SELECT * FROM users WHERE user IN (${mentions})
    `);

    const mails = [];

    for (const user of users) {
      mails.push(mail.send({
        to: user,
        subject: `${req.user.user} mentioned you in a post on the Gloveshack`,
        text: `Hi ${user.user}! There's a post with your name on it waiting on the shack. Check it out: ${BASE_URL}`,
        html: `Hi ${user.user}! There's a post with your name on it waiting on the shack. Check it out: <a href="${BASE_URL}">${BASE_URL}</a>`
      }));
    }

    Promise.all(mails).then(r => console.log(r), e => console.log(e));

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
