import express from "express";
import models from "../../models";
import crypto from 'crypto'

const sha256 = data => crypto.createHash('sha256').update(data).digest('base64')

const router = express.Router();

router.post("/", (req, res) => {
  const data = JSON.stringify(req.body.data)
  const hash = sha256(data);
  
  models.Channel.forge({
    data,
    hash,
    user_id: req.user.id
  })
  .save()
  .then(m => m.refresh())
  .catch(() => models.Channel.where('hash', hash).fetch())
  .then(m => res.status(201).send(m))
});

export default router;
