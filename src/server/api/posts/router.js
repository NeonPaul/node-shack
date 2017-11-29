import express from "express";
import models from "../../models";

const router = express.Router();

router.get("/", (req, res) => {
  models.Post.forge()
    .orderBy("time", "DESC")
    .fetchPage({
      pageSize: 50,
      withRelated: ["author", "reactions", "reactions.user", "reactions.type"]
    })
    .then(posts => {
      res.json(posts);
    });
});

router.post("/", async (req, res, next) => {
  try {
    const model = await models.Post.forge({
      content: req.body.content,
      user_id: req.user.id,
      bitchingabout: 0
    }).save();

    await model.refresh({ withRelated: ["author", "reactions"] });

    res.status(201).send(model);
  } catch (e) {
    next(e);
  }
});

router.merge("/:id", async (req, res, next) => {
  try {
    const model = await models.Post.where({ id: req.params.id }).fetch();
    if (!model) {
      throw new Error("Post not found");
    }
    if (model.get("user_id") !== req.user.id) {
      throw new Error("Cannot edit another user's post");
    }
    model.set({ content: req.body.content });
    await model.save();
    await model.refresh({ withRelated: ["author", "reactions"] });

    res.status(200).send(model);
  } catch (e) {
    next(e);
  }
});

export default router;
