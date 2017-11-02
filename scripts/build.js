// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fsx = require('fs-extra');
const fs = require('fs');
const clientConfig = require('../config/webpack.config.prod');
const serverConfig = require('../config/webpack.config.server');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

process.env.NODE_ENV = 'production';

const path = require('path');
const webpack = require('webpack');
const { execSync } = require('child_process');
const dist = paths.appBuild;

fsx.emptyDirSync(paths.appBuild);

console.log('⏳  Creating an optimized production build.');
console.log();

new Promise((res, rej) =>
  webpack([clientConfig, serverConfig]).run(
    (err, stats) => (err ? rej(error) : res(stats))
  )
)
  .then(stats => {
    if (stats.hasErrors()) {
      throw new Error(stats.toString('errors-only'));
    }

    // Generate the npm installastion instructions
    const packageJson = require('../package.json');
    delete packageJson.devDependencies;
    packageJson.scripts.start = 'node index.js';

    fs.writeFileSync(
      path.join(dist, 'package.json'),
      JSON.stringify(packageJson)
    );

    console.log('✅  Compiled successfully.');
    console.log();
  })
  .catch(err => {
    spinner.stop(true);

    console.error('🚫  Failed to create a production build. Reason:');
    console.log();

    if (err) {
      console.error(err.message || err);
    }

    process.exit(1);
  });
