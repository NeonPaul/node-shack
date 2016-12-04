var webpack = require('webpack')
var config = require('./webpack.config.js')
var proc = require('child_process').exec('npm rebuild node-sass')
proc.stdout.on('data', function (d) {
  console.log(d)
})
proc.stderr.on('data', function (d) {
  console.log(d)
})

proc.on('close', function () {
  var compiler = webpack(config)

  compiler.run(function (err, stats) {
    if (err) console.error(err)
    console.log(stats.toString({
      colors: true,
      modules: false
    }))
  })
})
