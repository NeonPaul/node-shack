const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const api = require('./api');

const compiler = webpack({
  ...require('../webpack.config.js'),
  mode: 'development'
});


const express = require('express');
const app = express();
app.use('/api', api);
app.use(middleware(compiler));

app.listen(3000, () => console.log('app listening on port 3000'));
