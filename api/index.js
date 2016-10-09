var jwt = require('jsonwebtoken');
var models = require('./models');
var PasswordHash = require('phpass').PasswordHash;
var passwordHash = new PasswordHash();
var secret = process.env.JWT_SECRET || '';
var router = require('express').Router()
var bp = require('body-parser')

function parseBody(request){
  return new Promise(resolve => {
    var body = [];
    request.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
      resolve(body);
    });
  });
}


function getUser(email){
  return models.User.where('email', email).fetch();
}

function authenticate(token){
  let decoded = jwt.verify(token, secret);
  return getUser(decoded.email);
}

function getToken(req){
  var token = req.headers.authorization
  token = token && token.match(/Bearer ([^$]+)$/i)
  token = token && token[1] || null

  return token
}

router.use(bp.json())

router.post('/auth', function(req, res){
  var user = getUser(req.body.email)

  Promise.all([
    user.get('email'),
    user.get('password')
  ]).then(([email, password]) => {
    var success = passwordHash.checkPassword(req.body.password, password)
    var newToken = jwt.sign({ email }, secret)

    res.json({ token: newToken })
  }, function(e){
    res.status(500).send(e.toString())
  })
})

router.use(function(req, res, next){
  var token = getToken(req)
  if(!token){
    res.sendStatus(403)
    return
  }
  var user = authenticate(token)
  req.user = user

  if(user){
    next()
  }else{
    res.sendStatus(403)
  }
})

router.get('/auth', function(req, res){
  res.json({
    data: req.user
  })
})

router.get('/posts', function(req, res){
  models.Post.forge().orderBy('time', 'DESC').fetchPage({
    pageSize: 50
  }).then(function(posts){
    res.json(posts)
  }, function(e){
    res.status(500).send(e.toString())
  })
})

module.exports = router
