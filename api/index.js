var jwt = require('jsonwebtoken');
var secret = process.env.JWT_SECRET || '';

module.exports = function(resource, req, res){
  var token = req.headers.authorization;
  token = token && token.match(/Bearer ([^$]+)$/i)
  token = token && token[1] || null;

  var request = {
    resource,
    method: req.method
  }
  res.setHeader('Content-Type', 'application/json');

  if(resource.indexOf('auth') === 0){
    switch(req.method){
      case 'POST':
        let newToken = jwt.sign({ foo: 'bar' }, secret);
        res.statusCode = 201;
        res.end(JSON.stringify({ token: newToken }, null ,4));
        // Lookup user
        // Create token if found
        // Return with 201
        // else return with 401
        break;
      case 'GET':
        try{
          let decoded = jwt.verify(token, secret);
          res.statusCode = 200;
          res.end(JSON.stringify(decoded, null, 4));
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
  }else{
    res.end(JSON.stringify(request, null, 4));
  }
}
