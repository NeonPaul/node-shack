var webpack = require('webpack')
var config = require('./webpack.config.js')

var compiler = webpack(config)

compiler.run(function(err, stats){
  if(err) throw err
  console.log(stats)
})


