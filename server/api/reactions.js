const express = require("express");
const models = require("../models");

const router = express.Router();

router.get("/", (req, res) => {
  models.ReactionType.forge()
    .fetchAll()
    .then(reactions => {
      res.json(reactions);
    });
});

module.exports = router;
