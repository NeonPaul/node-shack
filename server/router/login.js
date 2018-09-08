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

    const result = await getUser(user);

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

    res.state.message = `/login/reset?token=${token}`;
    req.found = 1;
    next();
  }catch(e) {
    next(e)
  }
});

const verifyToken = async (t) => {
  const token = jwt.decode(t);

  const user = await getUser(token.user);

  jwt.verify(t, user.password);

  return user;
}

route.get('/reset', async (req, res, next) => {
  try {
    await verifyToken(req.query.token);

    res.send(`<form method=post action="/login/change">
      <input type=hidden name=token value="${req.query.token}">
      New password <input type=password name=password><br>
      New password (repeat) <input type=password name=passwordRepeat><br>
      <button>Change</button>
    </form>`);
  }catch(e) {
    next(e)
  }
});

route.post('/change', async (req, res, next) => {
  try {
    const user = await verifyToken(req.body.token);

    const { password, passwordRepeat } = req.body;

    if (password !== passwordRepeat) {
      throw new Error('Passwords do not match');
    }

    const hash = passwordHash.hashPassword(password);

    await pool.query(sql`UPDATE users SET password=${hash} WHERE id=${user.id}`);

    login(user, req, res);
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = route;
