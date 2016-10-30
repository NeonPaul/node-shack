var path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/main.js'),
  output: {
    path: path.resolve(__dirname, '../static'),
    filename: 'app.bundle.js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue'
    }
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.s[ca]ss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  }
}
