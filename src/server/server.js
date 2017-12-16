import express from "express";
import { createServer } from "http";
import { Provider } from "react-redux";
import jwt from "jsonwebtoken";
import React from "react";
import ReactDOM from "react-dom/server";
import auth from "./auth";
import { default as createStore, SET, setToken } from "../store";
import api from "./api";
import parseForm from "universal-form/dist/server";
import FormData from "universal-form/dist/form-data";

const PORT = process.env.PORT || 3000;

function router() {
  const router = express.Router();

  auth(router);

  router.use("/api", api);

  router.use("*", async (req, res, next) => {
    try {
      const App = require("../App").default;
      const Html = require("../components/Html").default;
      const router = require("../router").default;

      const css = new Set();

      const context = {
        insertCss: (...styles) => {
          styles.forEach(style => {
            return css.add(style._getCss());
          });
        }
      };

      const store = createStore();

      const [body, route] = await Promise.all([
        parseForm(req),
        router.resolve({
          path: req.path,
          query: req.query,
          user: req.user
        })
      ]);

      const formData = body;

      if (route.redirect) {
        res.redirect(route.status || 302, route.redirect);
        return;
      }

      const data = { ...route };
      const Route = route.component;

      const token =
        req.user &&
        jwt.sign(
          { email: req.user.email || req.user },
          global.process.env.JWT_SECRET
        );

      if (req.user) {
        store.dispatch(setToken(token));
        store.dispatch(SET(req.user.serialize()));
      }

      const action = route.action || Route.action;

      if (action) {
        const redirect = await store.dispatch(
          action(req.method, formData, { cookie: req.headers.cookie })
        );

        if (req.method === "POST") {
          const redirectUrl =
            typeof redirect === "string" ? redirect : req.originalUrl;
          return res.redirect(redirectUrl);
        }
      }

      data.children = ReactDOM.renderToString(
        <Provider store={store}>
          <App context={context}>
            <Route />
          </App>
        </Provider>
      );

      data.styles = [{ id: "css", cssText: [...css].join("") }];
      data.scripts = [
        process.env.NODE_ENV === "production"
          ? JSON.parse(
              require("fs").readFileSync("./asset-manifest.json", "utf8")
            )["main.js"]
          : global.process.env.CLIENT_MAIN
      ];
      data.state = store.getState();
      data.user = req.user;

      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
      res.status(route.status || 200);
      res.send(`<!doctype html>${html}`);
    } catch (err) {
      next(err);
    }
  });

  return router;
}

if (process.env.NODE_ENV === "production") {
  const app = express();

  // Serve static pages before the auth stuff so we don't
  // create sessions on requests for assets
  app.use("/static", express.static("./static"));

  app.use(router());

  app.use((err, req, res, next) => {
    if (String(err.status) === "404") {
      res.status(404);
      res.send("Page not found");
      return;
    }
    res.status(err.status || 500);
    res.send(`Internal server error`);
  });

  const server = createServer(app);

  console.log("Starting server...");

  server.listen(PORT, err => {
    console.log(err || `==> 🌎  http://0.0.0.0:${PORT}/`);
  });
}

export default router();
