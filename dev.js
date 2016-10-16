var webpack = require('webpack')
var config = require('./build/webpack.config.js')
var webpackMiddleware = require('webpack-dev-middleware')

module.exports = webpackMiddleware(webpack(config),
  {
    quiet: true,
    watchOptions: {
      poll: true
    }
  })
