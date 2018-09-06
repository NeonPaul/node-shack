const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const config = require('../webpack.config.js');

const static = () => {
  const feCompiler = webpack({
    ...config,
    mode: 'development'
  });

  return middleware(feCompiler)
}

const server = () => {
  const serverCompiler = webpack({
    ...config,
    mode: 'development',
    target: 'node',
    entry: require.resolve('../src/app.js'),
    output: {
      filename: '[name].node.js',
      library: '', libraryTarget: 'commonjs'
    }
  });

  return new Promise((res, reject) => {
    serverCompiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err);
        return;
      }
      stats = stats.toJson();
      const files = [].concat(...stats.chunks.map(ch => ch.files)).map(f => stats.outputPath + '/' + f);
      if (!('main' in stats.assetsByChunkName)) {
        console.log(Object.keys(stats.assetsByChunkName));
        reject(new Error("Couldn't find 'main' in asset list"));
      }
      res(stats.outputPath + '/' + stats.assetsByChunkName.main);
      for (const f in files) {
        delete require.cache[f];
      }
    })
  });
};

module.exports = { server, static };
