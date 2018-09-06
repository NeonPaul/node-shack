const config = require('./webpack.config.js');

module.exports = {
  ...config,
  target: 'node',
  entry: require.resolve('./src/app.js'),
  output: {
    filename: '[name].node.js',
    library: '',
    libraryTarget: 'commonjs'
  }
};
