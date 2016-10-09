module.exports = {
  entry: '../src/main.js',
  output: {
    path: '../static',
    filename: 'app.bundle.js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue'
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  }
}
