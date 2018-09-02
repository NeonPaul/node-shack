const express = require("express");

const api = express.Router();

api.get("/", (req, res) => {
  res.send("Ok");
});

module.exports = api;
