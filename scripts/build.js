'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const fsx = require('fs-extra')
const chalk = require('chalk')
const clientConfig = require('../config/webpack.config.prod')
const serverConfig = require('../config/webpack.config.server')
const paths = require('../config/paths')

// Remove all content but keep the directory so that
// if you're in it, you don't end up in Trash
fsx.emptyDirSync(paths.appBuild)

const compiler = webpack([ clientConfig, serverConfig ])

module.exports = new Promise((resolve, reject) => compiler.run((err, stats) => {
  if (err) {
    return reject(err)
  }

  if (stats.hasErrors()) {
    return reject(stats.toJson().errors.join('\n'))
  }

  if (stats.hasWarnings()) {
    console.log(chalk.yellow('Warnings'))
    console.warn(stats.toJson().warnings.join('\n'))
  }

  resolve(stats)
})).then(
  ({stats}) => {
    const packageJson = require('../package.json')
    delete packageJson.devDependencies
    packageJson.scripts.start = 'node server.js'

    fs.writeFileSync(path.join(paths.appBuild, 'package.json'), JSON.stringify(packageJson))

    return {
      main: require.resolve('../build/' + require('../build/asset-manifest.json')['main.js'])
    }
  }
).catch(err => {
  console.error(err.stack || err)

  if (err.details) {
    console.error(err.details)
  }

  process.exit(1)
})
