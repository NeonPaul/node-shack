import express from "express";
import models from "../../models";

const router = express.Router();

router.get("/", (req, res) => {
  models.ReactionType.forge()
    .fetchAll()
    .then(reactions => {
      res.json(reactions);
    });
});

export default router;
