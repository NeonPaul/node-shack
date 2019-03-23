const exporess = require('express');
const sql = require('sql-tag');
const getenv = require('getenv');

const pool = require('../db');

const sha256 = data => crypto.createHash('sha256').update(data).digest('base64')

const route = new exporess.Router();

route.get('/@:user', async (req, res, next) => {
    const [users] = await pool.query(
      sql`SELECT * FROM users WHERE user=${req.params.user}`
    );
    const user = users[0];

    const profile = getenv('BASE_URL') + '/@' + user.user;

    res.json({
     '@context':         "https://www.w3.org/ns/activitystreams",
     'id': profile, type: 'Person', preferredUsername: user.user, inbox: profile+'/inbox',
     'icon': { url: user.avatar, mediaType: 'img/png', type:'Image' }
    });
});

route.get('/.well-known/webfinger',  async (req, res, next) => {
  try {
    const a = /[-a-z0-9._~!$&'()*+,;=]/i;
    const { resource } = req.query;
    const acc = resource.split(':')[1];
    const username = acc.split('@')[0];

    const [users] = await pool.query(
      sql`SELECT * FROM users WHERE user=${username}`
    );
    const user = users[0];

    const profile = user && (getenv('BASE_URL') + '/@' + user.user);

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

module.exports = route;

