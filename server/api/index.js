const express =require("express");
const bodyParser =require("body-parser");
const postRouter =require("./posts");
const reactionsRouter =require("./reactions");

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

api.use("*", (req, res) => {
  res.status(404).send("Not found");
});

module.exports= api;
