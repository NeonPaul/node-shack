const exporess = require('express');
const sql = require('sql-tag');
const getenv = require('getenv');

const pool = require('../db');

const sha256 = data => crypto.createHash('sha256').update(data).digest('base64')

const route = new exporess.Router();

route.get('/@', async (req, res, next) => {
  res.json({
   '@context': "https://www.w3.org/ns/activitystreams",
   'id': getenv('BASE_URL') + '/@',
   type: 'Group', name: 'Shack', preferredUsername: 'shack',
   inbox: getenv('BASE_URL') + '/inbox'
   //'icon': { url: user.avatar, mediaType: 'img/png', type:'Image' }
  });
});

route.get('/@:user', async (req, res, next) => {
    const [users] = await pool.query(
      sql`SELECT * FROM users WHERE user=${req.params.user.replace(/\./g, ' ')}`
    );
    const user = users[0];

    const profile = getenv('BASE_URL') + '/@' + user.user.replace(/ /g, '.');

    res.json({
     '@context':         "https://www.w3.org/ns/activitystreams",
     'id': profile, type: 'Person', name: user.user, preferredUsername: user.user.replace(/ /g, '.'), inbox: profile+'/inbox',
     'icon': { url: user.avatar, mediaType: 'img/png', type:'Image' }
    });
});

route.get('/.well-known/webfinger',  async (req, res, next) => {
  try {
    const a = /[-a-z0-9._~!$&'()*+,;=]/i;
    const { resource } = req.query;
    const acc = resource.split(':')[1];
    const username = acc.split('@')[0];

    let user;
    let profile;

    if (username === '_') {
      user = {
      }
      profile = getenv('BASE_URL') + '/@'
    } else {
      const [users] = await pool.query(
        sql`SELECT * FROM users WHERE user=${username} OR user=${username.replace(/\./g, ' ')}`
      );
      user = users[0];

      profile = user && (getenv('BASE_URL') + '/@' + user.user.replace(/ /g, '.'));
    }

    res.json(user ? {
      subject: resource,
      aliases: [profile],
      links: [{
        rel: 'self',
        type: 'application/activity+json',
        href: profile
      }]
    } :  null);
  } catch(e) {
    next(e);
  }
});

route.post('/inbox', async (req, res, next) => {
  // Todo: Verify signature, sanitize content
  return;

  if(req.body.actor !== 'https://kith.kitchen/users/Paul') {
    res.json({});
    return;
  }

  const body =  JSON.stringify(req.body);
  const sql = require('sql-tag');
  const pool = require('../db');

  await pool.query(
      sql`
        INSERT INTO posts ( content, user_id ) VALUES (${body}, 1);
      `
    );

  res.json({});
});

module.exports = route;

