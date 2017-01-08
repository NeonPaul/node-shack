var jwt = require('jsonwebtoken');
var models = require('./models');
var PasswordHash = require('phpass').PasswordHash;
var passwordHash = new PasswordHash();
var secret = process.env.JWT_SECRET || 'secret';
var router = require('express').Router()
var bp = require('body-parser')
var Mapper = require('jsonapi-mapper')

var mapper = new Mapper.Bookshelf()

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

  user.then(user => {
    return Promise.all([
      user.get('email'),
      user.get('password')
    ])
  }).then(([email, password]) => {
    var success = passwordHash.checkPassword(req.body.password, password)
    if(success){
      var newToken = jwt.sign({ email }, secret)

      res.json({ token: newToken })
    }else{
      res.status(403).json({
        error: 'Wrong username or password.'
      })
    }
  }, function(e){
    res.status(500).send(e.message)
  })
})

router.use(function(req, res, next){
  var token = getToken(req)
  if(!token){
    res.sendStatus(403)
    return
  }
  var user = authenticate(token)
  .then(user => {
    req.user = user

    if(user){
      next()
    }else{
      res.sendStatus(403)
    }
  }, e => {
    res.status(500).send(e.message)
  })
})

router.get('/auth', function(req, res){
  res.json({
    data: req.user
  })
})

router.get('/posts', function(req, res){
  models.Post.forge().fetchJsonApi({
    page: {
      limit: 50
    },
    sort: ['-time'],
    include: ['author']
  }).then(function(posts){
    res.json(mapper.map(posts, 'post'))
  }, function(e){
    res.status(500).send(e.message)
  })
})

module.exports = router
