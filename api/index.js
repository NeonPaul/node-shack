var jwt = require('jsonwebtoken');
var models = require('./models');
var PasswordHash = require('phpass').PasswordHash;
var passwordHash = new PasswordHash();
var secret = process.env.JWT_SECRET || '';

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
  console.log('email', email);
  return models.User.where('email', email).fetch();
}

function authenticate(token){
  let decoded = jwt.verify(token, secret);
  return getUser(decoded.email);
}

module.exports = function(resource, req, res){
  var token = req.headers.authorization;
  token = token && token.match(/Bearer ([^$]+)$/i)
  token = token && token[1] || null;

  var request = {
    resource,
    method: req.method
  };
  res.setHeader('Content-Type', 'application/json');

  if(resource.indexOf('auth') === 0){
    switch(req.method){
      case 'POST':
        try{
          var postBody;
          parseBody(req).then(body => {
            postBody = JSON.parse(body);
            return getUser(postBody.email);
          }).then(user => {
            console.log(postBody, user);
            var success = passwordHash.checkPassword(postBody.password, user.get('password'));

            let newToken = jwt.sign({ email: user.get('email') }, secret);
            res.statusCode = 201;
            res.end(JSON.stringify({ token: newToken }, null ,4));
          }).catch(e => {
            res.end(JSON.stringify({
              stack: `${e.stack}`
            }));
          });

          // Lookup user
          // Create token if found
          // Return with 201
          // else return with 401
        }catch(e){
          res.end(JSON.stringify(e.toString()));
        }
        break;
      case 'GET':
        try{
          authenticate(token).then(function(user){
            res.statusCode = 200;
            res.end(JSON.stringify(user, null, 4));
          }).catch(function(e){
            res.statusCode = 401;
            res.end(JSON.stringify(e.stack, null, 4));
          });

          // Validate token and return user with 200
          // else return with 401
        }catch(e){
          res.statusCode = 401;
          res.end(`{ "message": "Wrong auth: ${e.toString()}" }`);
        }
        break;
      default:
        res.statusCode = 405;
        res.end(`{ "message": "Only POST or GET accepted." }`);
        break;
    }
  }else if(resource.indexOf('posts') === 0){
    switch(req.method){
      case "GET":
        authenticate(token).then(function(){
          models.Post.forge().orderBy('time', 'DESC').fetchPage({
            pageSize: 50
          }).then(function(posts){
            res.end(JSON.stringify(posts, null, 4));
          });
        });
        break;
      default:
        res,statusCode = 405;
        res.end('405');
        break;
    }

  }else{
    res.end(JSON.stringify(request, null, 4));
  }
}
