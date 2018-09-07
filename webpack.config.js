module.exports = {
  module: {
    rules: [
      {
        test: /service-worker\/index\.js/,
        use: [{
          loader: 'service-worker-loader',
          options: {
            filename: 'sw.js'
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          /service-worker\/index\.js/,
        ],
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
