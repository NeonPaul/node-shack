const getenv = require('getenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const NODE_ENV = getenv('NODE_ENV', 'production');

// Disable env fallbacks before requiring project files
if (NODE_ENV !== 'development') {
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

// Deal with authentication
app.use(auth);
app.use(router);

app.use((req, res, next) => {
  if(req.found) {
    res.send();
  } else {
    next();
  }
});

// Serve static files
if (NODE_ENV === 'development') {
  const webpack = require('webpack');
  const middleware = require('webpack-dev-middleware');

  const compiler = webpack({
    ...require('../webpack.config.js'),
    mode: 'development'
  });

  app.use(middleware(compiler));
} else {
  app.use(express.static('dist'));
}

// Start app
app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
