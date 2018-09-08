const exporess = require('express');
const sql = require('sql-tag');
const { PasswordHash } = require("phpass");
const jwt = require("jsonwebtoken");
const getenv = require("getenv");

const pool = require('../db');

const passwordHash = new PasswordHash();
const route = new exporess.Router();
const JWT_SECRET = getenv("JWT_SECRET", "big secret");
const getUser = async user => {
  const [ results ] = await pool.query(sql`SELECT * FROM users WHERE email=${user} OR user=${user}`);

  if (!results || !results[0]) {
    throw new Error(`No user ${ user } found`);
  }

  return results[0];
}

const login = (result, req, res) => {
    // TODO: Use another value for token, not email
    const token = jwt.sign(
      { email: result.email },
      JWT_SECRET
    );

    res.cookie('token', token, { maxAge: 365 * 24 * 3600 * 1000 });
    req.found = true;
    // TODO: Share this logic with auth.js
    // or do a redirect and have index pick up the correct state
    res.state.user = {
      user: result.user,
      email: result.email,
    }
    res.location('/');
}

route.post('/',  async (req, res, next) => {
  try {
    const { user, password } = req.body;

    if (!user || !password) {
      throw new Error('User or password is empty');
    }

    const result = await getUser();

    if (!passwordHash.checkPassword(password, result.password)) {
      throw new Error('Password incorrect');
    }

    login(result, req, res);
    next();
  } catch(e) {
    next(e);
  }
});

route.post('/reset', async (req, res, next) => {
  try {
    const { user } = req.body;

    const result = await getUser(user);

    const token = jwt.sign({
      user: result.user
    }, result.password, { expiresIn: '1d' });

    res.send(`<a href="/login/reset?token=${token}">Reset</a>`);
  }catch(e) {
    next(e)
  }
});

route.get('/reset', async (req, res, next) => {
  try {
    const token = jwt.decode(req.query.token);

    const user = await getUser(token.user);

    jwt.verify(req.query.token, user.password);

    login(user, req, res);
    next();
  }catch(e) {
    next(e)
  }
});

module.exports = route;
