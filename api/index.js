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
  function output(data){
    var doc = {
      data
    };
    res.end(JSON.stringify(doc), null, 4);
  }

  function httpError(code, e){
    var doc = {
      errors: [
        {
          code: String(code),
          meta: {
            stack: e && e.stack
          }
        }
      ]
    };
    res.statusCode = code;
    res.end(JSON.stringify(doc, null, 4));
  }

  function outputError(e){
    var doc = {
      errors: [
        {
         status: '500',
         meta: {
           stack: e.stack
         }
        }
      ]
    };
    res.statusCode = 500;
    res.end(JSON.stringify(doc, null, 4));
  }

  var token = req.headers.authorization;
  token = token && token.match(/Bearer ([^$]+)$/i)
  token = token && token[1] || null;

  res.setHeader('Content-Type', 'application/json');

  resource = resource.replace(/\/+$/, '');

  if(resource === 'auth'){
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

            output({ token: newToken }, 201);
          }).catch(e => {
            outputError(e);
          });

          // Lookup user
          // Create token if found
          // Return with 201
          // else return with 401
        }catch(e){
          outputError(e);
        }
        break;
      case 'GET':
        try{
          authenticate(token).then(function(user){
            output(user);
          }).catch(function(e){
            httpError(401, e);
          });

          // Validate token and return user with 200
          // else return with 401
        }catch(e){
          httpError(401, e);
        }
        break;
      default:
        httpError(405);
        break;
    }
  }else if(resource.indexOf('posts') === 0){
    switch(req.method){
      case "GET":
        authenticate(token).then(function(){
          models.Post.forge().orderBy('time', 'DESC').fetchPage({
            pageSize: 50
          }).then(function(posts){
            output(posts);
          });
        });
        break;
      default:
        httpError(405)
        break;
    }

  }else{
    httpError(404);
  }
}
