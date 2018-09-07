const exporess = require('express');
const sql = require('sql-tag');
const crypto = require('crypto');

const pool = require('../db');

const sha256 = data => crypto.createHash('sha256').update(data).digest('base64')

const route = new exporess.Router();

route.post('/',  async (req, res, next) => {
  try {
    const data = req.body.data;
    const hash = sha256(data);

    await pool.query(
      sql`
        INSERT INTO channels ( data, hash, user_id ) VALUES (${data}, ${hash}, ${req.user.id});
      `
    );

    req.found = true;
    res.location('/');

    next();
  } catch(e) {
    next(e);
  }
});

module.exports = route;
