const config = require('./webpack.config.js');
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const {DefinePlugin} = require('webpack');

const gitRevisionPlugin = new GitRevisionPlugin({
  lightweightTags: true
});

module.exports = {
  ...config,
  plugins: [
    new DefinePlugin({
      'VERSION': JSON.stringify(gitRevisionPlugin.version())
    })
  ],
  target: 'node',
  entry: require.resolve('./src/app.js'),
  output: {
    filename: '[name].node.js',
    library: '',
    libraryTarget: 'commonjs'
  }
};
