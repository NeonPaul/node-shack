var jwt = require('jsonwebtoken');
var models = require('./models');
var PasswordHash = require('phpass').PasswordHash;
var passwordHash = new PasswordHash();
var secret = process.env.JWT_SECRET || 'secret';
var router = require('express').Router()
var bp = require('body-parser')
var Mapper = require('jsonapi-mapper')

var mapper = new Mapper.Bookshelf()
var mapperConfig =  {
  typeForModel: {
    author: 'user',
    post: 'post'
  }
}

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
  let decoded = jwt.verify(token, secret)
  return getUser(decoded.email)
}

function getToken(req){
  var token = req.headers.authorization
  token = token && token.match(/Bearer ([^$]+)$/i)
  token = token && token[1] || null

  return token
}

router.use(bp.json())
router.use(bp.json({
  type: 'application/vnd.api+json'
}))

router.post('/auth/facebook', function (req, resp) {
  var fbToken = req.body.accessToken
  require('https').get(
    'https://graph.facebook.com/me?fields=email&access_token=' + fbToken,
    res => {
      var body = ''
      res.on('data', d => {
        body += d
      })

      res.on('end', () => {
        var email = JSON.parse(body).email
        getUser(email)
        .then(() => {
          var token = jwt.sign({ email }, secret)
          resp.json({ token })
        })
        .catch(e => {
          resp.status(403).json({
            message: e.message || String(e)
          })
        })
      })
    }
  )
})

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
    res.status(403).json({ message: 'No token provided' })
    return
  }
  var user = authenticate(token)
  .then(user => {
    req.user = user

    if(user){
      next()
    }else{
      res.status(403).json({message: 'No user found'})
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
    res.json(mapper.map(posts, 'post', mapperConfig))
  }, function(e){
    res.status(500).send(e.message)
  })
})

router.post('/posts', function (req, res) {
  var data = req.body && req.body.data

  if (data && data.type === 'post') {
    var attributes = req.body.data.attributes

    models.Post.forge({
      content: attributes && attributes.content,
      user_id: req.user.id,
      bitchingabout: 0
    })
    .save()
    .then(m => m.refresh({ withRelated: ['author'] }))
    .then(
      m => res.status(201).send(mapper.map(m, 'post', mapperConfig)),
      e => res.status(500).send(e.message)
    )
  } else {
    var msg
    if (!req.body) {
      msg = 'No body'
    } else if (!req.body.data) {
      msg = 'No data for body ' + JSON.stringify(req.body)
    } else {
      msg = 'Invalid type ' + req.body.data.type
    }

    res.status(400).send(msg)
  }
})

module.exports = router
