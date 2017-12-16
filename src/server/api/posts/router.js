import express from "express";
import models from "../../models";

const router = express.Router();

const postRelations = [
  "author",
  "reactions",
  "reactions.user",
  "reactions.type"
];

router.get("/", (req, res) => {
  models.Post.forge()
    .orderBy("time", "DESC")
    .fetchPage({
      pageSize: 50,
      withRelated: postRelations
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

    await model.refresh({ withRelated: postRelations });

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
    await model.refresh({ withRelated: postRelations });

    res.status(200).send(model);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/reactions", async (req, res, next) => {
  try {
    const model = await models.Post.where({ id: req.params.id }).fetch({
      withRelated: postRelations
    });
    if (!model) {
      throw new Error("Post not found");
    }

    const reactions = await model.related("reactions");
    const reaction =
      reactions.find(r => r.get("user_id") === req.user.id) ||
      models.Reaction.forge({ user_id: req.user.id, post_id: req.params.id });

    reaction.set({ response_type_id: req.body.reactionId });

    await reaction.save();
    await model.refresh({ withRelated: postRelations });

    res.status(200).send(model);
  } catch (e) {
    next(e);
  }
});

export default router;
