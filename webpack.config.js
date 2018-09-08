const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /service-worker\.js/,
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
          /service-worker\.js/,
        ],
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin(['src/manifest.json'])
  ]
};
