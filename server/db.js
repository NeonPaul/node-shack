const getenv = require('getenv');
const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
  host: getenv("DB_HOST", "127.0.0.1"),
  user: getenv("DB_USER", "db_user"),
  password: getenv("DB_PASS", "db_pass"),
  database: getenv("DB_NAME", "shack"),
  charset: "utf8mb4"
});
