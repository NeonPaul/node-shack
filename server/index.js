const getenv = require('getenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const ReactDOMServer = require('react-dom/server');
const ST = require("stream-template");
const React = require('react');
const NODE_ENV = getenv('NODE_ENV', 'production');
const FALLBACKS = getenv('FALLBACKS', '');

// Disable env fallbacks before requiring project files
if (NODE_ENV !== 'development' && !FALLBACKS) {
  getenv.disableFallbacks();
}

// Inclue project files
const auth = require('./auth');
const router = require('./router');

// Set up app
const app = express();
const PORT = getenv('PORT', 3000);

// Configure parsers
app.use(cookieParser())
app.use((req, res, next) => {
  res.state = {};
  next();
})

// Deal with authentication
app.use(auth);
app.use(router);

// Serve static files
if (NODE_ENV === 'development') {
  app.use(require('./dev').static());
} else {
  app.use(express.static('dist'));
}

app.use(async (req, res, next) => {
  try {
    if(!req.accepts('text/html')) {
      return next();
    }

    const App =
      (NODE_ENV === 'development') ?
        require(await require('./dev').server()).default
      :
        require('../dist/main.node.js').default
      ;

    const app = React.createElement(App, {
      state: res.state
    });

    ST`<!doctype HTML>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(res.state)};
        </script>
      </head>
      <body>
        <div id="root">${ReactDOMServer.renderToNodeStream(app)}</div>
      </body>
      <script src="main.js"></script>
    </html>
    `.pipe(res);
  } catch(e) {
    next(e);
  }
});

app.use((req, res, next) => {
  if(req.found) {
    res.json(res.state);
  } else {
    next();
  }
});

// Start app
app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
