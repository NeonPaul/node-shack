import express from "express";
import bodyParser from "body-parser";
import postRouter from "./api/posts/router";
import reactionsRouter from "./api/reactions/router";
import subscriptionsRouter from "./api/subscriptions";
import channelsRouter from "./api/channels";

const api = express.Router();

api.use(bodyParser.json());

function getToken(req) {
  var token = req.headers.authorization;
  token = token && token.match(/Bearer ([^$]+)$/i);
  token = (token && token[1]) || null;

  return token;
}

api.use((req, res, next) => {
  var token = getToken(req);
  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  next();
});

api.get("/", (req, res) => {
  res.send("Ok");
});

api.use("/posts?", postRouter);
api.use("/reactions?", reactionsRouter);
api.use("/channels?", channelsRouter);
api.use("/subscriptions?", subscriptionsRouter);

api.use("*", (req, res) => {
  res.status(404).send("Not found");
});

export default api;
