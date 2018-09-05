const express = require("express");
const bodyParser = require("body-parser");

const login = require('./login');

const router = express.Router();

router.use(bodyParser.json());
router.use('/login', login);

module.exports = router;
