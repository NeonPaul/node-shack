const exporess = require('express');
const sql = require('sql-tag');
const { PasswordHash } = require("phpass");
const jwt = require("jsonwebtoken");
const getenv = require("getenv");

const pool = require('../db');
const mail = require('../mail');

const passwordHash = new PasswordHash();
const route = new exporess.Router();

const JWT_SECRET = getenv("JWT_SECRET", "big secret");
const baseUrl = getenv('BASE_URL', 'http://localhost:3000');

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
    const user = await getUser(req.body.user);

    const token = jwt.sign({
      user: user.user
    }, user.password, { expiresIn: '1d' });

    const resetLink = `${baseUrl}/login/reset?token=${token}`;

    const mailOptions = {
      to: `"${user.user}" <${user.email}>`, // list of receivers
      subject: 'Password reset link', // Subject line
      text: `Hi ${user.user}, here is your password reset link for the glove shack:
${resetLink}`, // plain text body
      html: `<p>Hi ${user.user}, here is your password reset link for the glove shack:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>` // html body
    };

    console.log(await mail.send(mailOptions));

    res.state.message = `Reset email sent, please check your inbox (${user.email.replace(/\B.\B/g, '*')}). It could take 5 to 10 minutes to be delivered.`;
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
    if (!req.user) {
      await verifyToken(req.query.token);
    }

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
    const user = req.user || await verifyToken(req.body.token);

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

route.get('/logout', async (req, res, next) => {
  try {
    res.cookie('token', '', { maxAge: 0 });
    req.found = true;
    res.state.user = null;
    req.user = null;
    //res.location('/');
    next();
  }catch(e) {
    next(e);
  }
});

module.exports = route;
