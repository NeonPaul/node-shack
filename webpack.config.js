const CopyWebpackPlugin = require('copy-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const {DefinePlugin} = require('webpack');

const gitRevisionPlugin = new GitRevisionPlugin({
  lightweightTags: true
});


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
    new CopyWebpackPlugin(['src/manifest.json']),
    new DefinePlugin({
      'VERSION': JSON.stringify(gitRevisionPlugin.version())
    })
  ]
};
