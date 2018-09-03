const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const models = require("./models");
const PasswordHash = require("phpass").PasswordHash;
const passwordHash = new PasswordHash();
const FacebookStrategy = require("passport-facebook");
const getenv = require("getenv");

function getUser(email) {
  return models.User.where("email", email).fetch();
}

function createUser(email, user) {
  user = user || email.split("@")[0];
  return models.User.forge({ email, user }).save();
}

const [
  FB_APP_ID,
  FB_APP_SECRET,
  ROOT_URL,
  NODE_ENV,
  REDIS_URL,
  SESSION_SECRET
] = [
  ["FB_APP_ID", "none"],
  ["FB_APP_SECRET", "none"],
  ["ROOT_URL", "/"],
  ["NODE_ENV", "development"],
  ["REDIS_URL", "localhost"],
  ["SESSION_SECRET", "keyboard cat"]
].map(k => getenv(...k))

module.exports = app => {
  console.log('using')
  passport.use(
    new Strategy(async function(email, password, cb) {
      try {
        const user = await getUser(email);
        const pwHash = user && (await user.get("password"));

        if (user && passwordHash.checkPassword(password, pwHash)) {
          cb(null, user);
        } else {
          cb(null, false, {
            message: user ? "Password incorrect" : "User not found"
          });
        }
      } catch (e) {
        cb(e);
      }
    })
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: FB_APP_ID,
        clientSecret: FB_APP_SECRET,
        callbackURL: ROOT_URL + '/fb-auth',
        profileFields: ["emails", "displayName"]
      },
      async function(accessToken, refreshToken, profile, cb) {
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
          return cb(null, false, {
            message:
              "You must provide access to your email to login with facebook."
          });
        }

        try {
          let user = await getUser(email);
          if (!user) {
            user = await createUser(email, profile.displayName);
          }
          return cb(null, user);
        } catch (err) {
          return cb(err, null);
        }
      }
    )
  );

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  passport.serializeUser(function(user, cb) {
    try {
      cb(null, user.get("email"));
    } catch (e) {
      cb(e, null);
    }
  });

  passport.deserializeUser(async function(email, cb) {
    try {
      const u = await getUser(email);
      cb(null, u);
    } catch (e) {
      cb(e, null);
    }
  });

  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.
  const sessionConfig = {};

  if (NODE_ENV === "production") {
    sessionConfig.store = new RedisStore({
      url: REDIS_URL
    });
  }

  app.use(require("cookie-parser")());
  app.use("/login", require("body-parser").urlencoded({ extended: true }));
  app.use(require("body-parser").json());
  app.use(
    session({
      ...sessionConfig,
      secret: SESSION_SECRET,
      resave: false, // Don't re-save if session has not been modified
      saveUninitialized: false // Don't save session until it has been modified
    })
  );

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());

  const authSuccess = function(req, res, next) {
    try {
      req.session.user = req.user;
      res.redirect("/");
    } catch (e) {
      next(e);
    }
  };

  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/" }),
    authSuccess
  );

  app.get(
    '/fb-login',
    passport.authenticate("facebook", { failureRedirect: "/" }),
    authSuccess
  );

  app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
  });
};
