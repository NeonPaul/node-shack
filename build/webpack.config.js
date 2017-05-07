var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    'app.bundle': path.resolve(__dirname, '../src/main.js'),
    sw: path.resolve(__dirname, '../src/sw.js')
  },
  output: {
    path: path.resolve(__dirname, '../static'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue'
    },
    extensions: ["", ".webpack.js", ".web.js", ".js", ".json", '.vue']
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.s[ca]ss$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'VAPID_PUBLIC',
      'FB_APP_ID'
    ])
  ],

  vue: {
    loaders: {
      js: 'babel'
    }
  },

  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime', 'transform-es2015-modules-commonjs']
  }
}
