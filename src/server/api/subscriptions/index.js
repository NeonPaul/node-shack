import express from "express";
import models from "../../models";

const router = express.Router();

router.post("/", (req, res) => {
  models.Subscription.forge({
    user_id: req.user.id
  })
  .save()
  .then(m => m.refresh())
  .then(m => res.status(201).send(m))
});

export default router;
