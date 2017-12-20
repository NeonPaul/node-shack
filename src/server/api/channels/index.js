import express from "express";
import models from "../../models";
import crypto from 'crypto'

const sha256 = data => crypto.createHash('sha256').update(data).digest('base64')

const router = express.Router();

router.post("/", (req, res) => {
  models.Channel.forge(({
    data: JSON.stringify(req.body.data),
    hash: sha256(JSON.stringify(req.body.data)),
    user_id: req.user.id
  })
  .save()
  .then(m => m.refresh())
  .then(m => res.status(201).send(m))
});

export default router;
