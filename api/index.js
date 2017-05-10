var jwt = require('jsonwebtoken')
var models = require('./models')
var PasswordHash = require('phpass').PasswordHash
var passwordHash = new PasswordHash()
var secret = process.env.JWT_SECRET || 'secret'
var router = require('express').Router()
var bp = require('body-parser')
var Mapper = require('jsonapi-mapper')

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') {
    res.send()
  } else {
    next()
  }
})

var mapper = new Mapper.Bookshelf()
var mapperConfig = {
  typeForModel: {
    author: 'user',
    post: 'post',
    subscription: 'subscription',
    channel: 'channel',
    reaction: 'reaction',
    type: 'reaction-type'
  }
}

var mapError = e =>
  JSON.stringify({
    errors: [
      {
        detail: e.message || String(e)
      }
    ]
  })

function getUser(email) {
  return models.User.where('email', email).fetch({ require: true })
}

function authenticate(token) {
  let decoded = jwt.verify(token, secret)
  return getUser(decoded.email)
}

function getToken(req) {
  var token = req.headers.authorization
  token = token && token.match(/Bearer ([^$]+)$/i)
  token = (token && token[1]) || null

  return token
}

router.use(bp.json())
router.use(
  bp.json({
    type: 'application/vnd.api+json'
  })
)

router.post('/auth/facebook', function(req, resp) {
  var fbToken = req.body.accessToken
  require(
    'https'
  ).get(
    'https://graph.facebook.com/me?fields=name,email&access_token=' + fbToken,
    res => {
      var body = ''
      res.on('data', d => {
        body += d
      })

      res.on('end', () => {
        body = JSON.parse(body)
        var email = body.email
        if (!email) {
          return resp
            .status(400)
            .json(
              '"Couldn\'t get your email from facebook. Please make sure ' +
                'your email is registered with facebook and available to ' +
                'the glove shack login app."'
            )
        }
        getUser(body.email)
          .catch(() =>
            models.User
              .forge({
                user: body.name,
                email: body.email
              })
              .save()
          )
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

router.post('/auth', function(req, res) {
  var user = getUser(req.body.email)

  user
    .then(user => {
      return Promise.all([user.get('email'), user.get('password')])
    })
    .then(
      ([email, password]) => {
        var success = passwordHash.checkPassword(req.body.password, password)
        if (success) {
          var newToken = jwt.sign({ email }, secret)

          res.json({ token: newToken })
        } else {
          res.status(403).json({
            error: 'Wrong username or password.'
          })
        }
      },
      function(e) {
        res.status(500).send(e.message)
      }
    )
})

router.use(function(req, res, next) {
  var token = getToken(req)
  if (!token) {
    res.status(403).json({ message: 'No token provided' })
    return
  }
  authenticate(token).then(
    user => {
      req.user = user

      if (user) {
        next()
      } else {
        res.status(403).json({ message: 'No user found' })
      }
    },
    e => {
      res.status(500).send(e.message)
    }
  )
})

router.use('/dump', require('./dump'))

router.get('/auth', function(req, res) {
  res.json({
    data: req.user
  })
})

router.put('/password', function(req, res) {
  var password = passwordHash.hashPassword(req.body.password)

  req.user
    .set({ password })
    .save()
    .then(() => res.status(200).json({}), () => res.sendStatus(500))
})

router.get('/posts', function(req, res) {
  models.Post
    .forge()
    .fetchJsonApi({
      page: {
        limit: 50
      },
      sort: ['-time'],
      include: ['author']
    })
    .then(
      function(posts) {
        res.json(mapper.map(posts, 'post', mapperConfig))
      },
      function(e) {
        res.status(500).send(e.message)
      }
    )
})

addResource('/posts', {
  type: 'post',
  model: models.Post,
  refreshOpts: { withRelated: ['author'] },
  values: (attributes, user) => ({
    content: attributes && attributes.content,
    user_id: user.id,
    bitchingabout: 0
  })
})

addResource('/subscriptions', {
  type: 'subscription',
  model: models.Subscription,
  values: (attributes, user) => ({
    type: attributes && attributes.type,
    user_id: user.id
  })
})

var crypto = require('crypto')

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('base64')
}

addResource('/channels', {
  type: 'channel',
  model: models.Channel,
  values: (attributes, user) => ({
    data: attributes && JSON.stringify(attributes.data),
    hash: attributes && sha256(JSON.stringify(attributes.data)),
    user_id: user.id
  })
})

function addResource(url, options = {}) {
  var values =
    options.values ||
    function() {
      return {}
    }
  var type = options.type
  var model = options.model
  var refreshOpts = options.refreshOpts

  router.post(url, function(req, res) {
    var data = req.body && req.body.data

    if (data && data.type === type) {
      var attributes = req.body.data.attributes

      model
        .forge(values(attributes, req.user))
        .save()
        .then(m => m.refresh(refreshOpts))
        .then(m =>
          models.Channel
            .query(qb => {
              qb.innerJoin(
                'subscriptions',
                'channels.user_id',
                'subscriptions.user_id'
              )
              qb.where('subscriptions.type', '=', type)
              qb.where('subscriptions.user_id', '<>', req.user.id)
            })
            .fetchAll()
            .then(channels => {
              channels.forEach(channel =>
                channel
                  .push(
                    JSON.stringify({
                      type: type,
                      action: 'create',
                      id: m.get('id')
                    })
                  )
                  .catch(e => {
                    channel.destroy()
                  })
              )
              return m
            })
        )
        .then(
          m => res.status(201).send(mapper.map(m, type, mapperConfig)),
          e => res.status(500).send(mapError(e))
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

      res.status(400).send(mapError(msg))
    }
  })
}

const RecordNotFound = 404
const Ok = payload => ({
  type: Ok,
  payload
})
const MiscError = message => ({
  type: MiscError,
  message
})
const NotAuthorized = 401

function expressOutput(res) {
  return function(message) {
    if (typeof message === 'number') {
      res.sendStatus(message)
    } else {
      switch (message.type) {
        case Ok:
          res.send(200, message.payload)
        case MiscError:
          res.send(500, message.message || 'Infernal Server Error')
      }
    }
  }
}

function expressInput(req) {
  return req.body
}

function jsonApiInput(body) {
  return body.data.attributes
}

function editPost(id, { content }) {
  return function(user) {
    return function(output) {
      models.Post.where('id', id).fetch({ require: true }).then(
        post => {
          if (post.get('user_id') !== user.get('id')) {
            return output(NotAuthorized)
          }
          post
            .set({ content })
            .save()
            .then(m => m.refresh({ withRelated: ['author'] }))
            .then(
              m => output(Ok(mapper.map(m, 'post', mapperConfig))),
              () => output(MiscError)
            )
        },
        e => {
          output(RecordNotFound)
        }
      )
    }
  }
}

function addReaction(postId, { type }) {
  return function(user) {
    return function(output) {
      var key = {
        post_id: postId,
        user_id: user.get('id')
      }
      models.Reaction
        .where(key)
        .fetch()
        .then(model => {
          if (!model) {
            model = Post.forge(key)
          }
          return model.save({
            type
          })
        })
        .then(m => m.refresh())
        .then(
          m => output(Ok(mapper.map(m, 'reaction', mapperConfig))),
          e => output(MiscError(e.message || String(e)))
        )
    }
  }
}

function readReactionTypes() {
  models.ReactionType
    .fetch()
    .then(models => output(Ok(mapper.map(m, 'reaction-type', mapperConfig))))
}

router.post('/post/:id', (req, res) => {
  var output = expressOutput(res)
  var input = jsonApiInput(expressInput(req))
  var edit = editPost(req.param('id'), input)
  edit(req.user)(output)
})

router.post('/post/:id/react', (req, res) => {
  var output = expressOutput(res)
  var input = jsonApiInput(expressInput(req))
  var edit = addReaction(req.param('id'), input)
  edit(req.user)(output)
})

router.get('/reaction-types', (req, res) => {
  var output = expressOutput(res)
  var read = readReactionTypes()
  read(req.user)(output)
})

module.exports = router
