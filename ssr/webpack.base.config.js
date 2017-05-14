const path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
  //    vue: 'vue/dist/vue'
    },
    extensions: [".webpack.js", ".web.js", ".js", ".json", '.vue']
  },
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue-loader',
          options:   {
            loaders: {
              js: 'babel-loader'
            }
          }
        },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.s[ca]ss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
