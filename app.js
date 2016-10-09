var sysInfo = require('./utils/sys-info')
var env     = process.env
var express = require('express')
var api = require('./api')

var app = express()

// IMPORTANT: Your application HAS to respond to GET /health with status 200
//            for OpenShift health monitoring
app.get('/health', function(req, res){
  res.sendStatus(200)
})
app.get('/info/:type', function(req, res, next){
  var info = sysInfo[req.params.type]
  if(info){
    res.set('Cache-Control', 'no-cache, no-store')
    res.json(info())
  }else{
    next()
  }
})
app.use(express.static(__dirname + '/static'))

app.use('/api', api)

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`)
});
