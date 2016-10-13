var webpack = require('webpack')
var config = require('./webpack.config.js')

var compiler = webpack(config)

compiler.run(function(err, stats){
  if(err) console.error(err)
  console.log(stats.toString({
    colors: true,
    modules: false
  }))
})
