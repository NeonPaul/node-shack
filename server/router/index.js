const express = require("express");
const bodyParser = require("body-parser");

const login = require('./login');
const main = require('./main');
const notifications = require('./notifications');

const router = express.Router();
const loggedIn = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: false
}))
router.use('/login', login);

loggedIn.use((req, res, next) => {
  if (!req.user) {
    next({ noauth: true });
    return;
  }

  next();
});

loggedIn.use(main);
loggedIn.use('/notifications?', notifications);

loggedIn.use((err, req, res, next) => {
  if (err.noauth) {
    next();
  } else {
    next(err);
  }
});
router.use(loggedIn);

module.exports = router;
