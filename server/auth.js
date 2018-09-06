const getenv = require("getenv");
const jwt = require("jsonwebtoken");
const sql = require('sql-tag');

const pool = require('./db');

const JWT_SECRET = getenv("JWT_SECRET", "big secret");

module.exports = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return next();
    }

    // TODO: Add this logic to separate file combined with login logic
    // TODO: Do all this work one time only then store in session
    const { email } = jwt.verify(token, JWT_SECRET);

    const [ results ] = await pool.query(sql`SELECT user, id, email FROM users WHERE email=${email}`);
    if (results && results[0]) {
      req.user = results[0];
      res.state.user = {
        user: req.user.user,
        email: req.user.email
      }
    }

    next();
  } catch(e) {
    console.log('Warn:', e.message);
    next();
  }
}
