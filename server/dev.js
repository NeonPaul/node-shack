const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const express = require('express');
const api = require('./api');

const auth = require('./auth');

const app = express();

auth(app);

const compiler = webpack({
  ...require('../webpack.config.js'),
  mode: 'development'
});

app.use('/api', api);
app.use(middleware(compiler));

app.listen(3000, () => console.log('app listening on port 3000'));
