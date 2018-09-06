const exporess = require('express');
const sql = require('sql-tag');
const { PasswordHash } = require("phpass");
const jwt = require("jsonwebtoken");
const getenv = require("getenv");

const pool = require('../db');

const passwordHash = new PasswordHash();
const route = new exporess.Router();
const JWT_SECRET = getenv("JWT_SECRET", "big secret");

route.post('/',  async (req, res, next) => {
  try {
    const { user, password } = req.body;

    if (!user || !password) {
      throw new Error('User or password is empty');
    }

    const [ results ] = await pool.query(sql`SELECT * FROM users WHERE email=${user} OR user=${user}`);

    if (!results || !results[0]) {
      throw new Error(`No user ${ user } found`);
    }

    if (!passwordHash.checkPassword(password, results[0].password)) {
      throw new Error('Password incorrect');
    }

    // TODO: Use another value for token, not email
    const token = jwt.sign(
      { email: results[0].email },
      JWT_SECRET
    );

    res.cookie('token', token, { maxAge: 365 * 24 * 3600 * 1000 });
    req.found = true;
    // TODO: Share this logic with auth.js
    // or do a redirect and have index pick up the correct state
    res.state.user = {
      user: results[0].user,
      email: results[0].email,
    }
    res.location('/');
    next();
  } catch(e) {
    next(e);
  }
});

module.exports = route;
