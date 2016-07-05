var jwt = require('jsonwebtoken');

module.exports = function(resource, req, res){
  var token = req.headers['Authorization'];
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
        let token = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET);
        res.status(201);
        // Lookup user
        // Create token if found
        // Return with 201
        // else return with 401
        break;
      case 'GET':
        let decoded;
        if(decoded = jwt.verify(token, process.env.JWT_SECRET)){
          res.status(200).end(JSON.stringify(decoded));
        }else{
          res.status(401).end('{ "message": "Wrong auth." }');
        }
        // Validate token and return user with 200
        // else return with 401
        break;
      default:
        res.status(405).end(`{ "message": "Only POST or GET accepted." }`);
        break;
    }
  }else{
    res.end(JSON.stringify(request, null, 4));
  }
}
