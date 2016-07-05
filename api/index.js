var jwt = require('jsonwebtoken');
var PasswordHash = require('phpass').PasswordHash;
var mysql      = require('mysql');
var secret = process.env.JWT_SECRET || '';

var connection = mysql.createConnection({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : 'shack'
});
connection.connect();


function getUser(email){
  email = email.replace(/'/g, `\\'`);
  return new Promise(function(res, rej){
    var sql = `SELECT * FROM \`users\` WHERE \`email\`='${email}'`;
    connection.query(sql, function(err, rows, fields) {
      if (err) rej(err);
      res(rows[0]);
    });
  });
}

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
        try{
          getUser('neonpaul@gmail.com').then(user => {
            var password = 'abc123';
            var success = passwordHash.checkPassword(password, user.password);

            let newToken = jwt.sign({ email: user.email }, secret);
            res.statusCode = 201;
            res.end(JSON.stringify({ token: newToken }, null ,4));
          }).catch(e => {
            res.end(JSON.stringify(e.toString()));
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
          var passwordHash = new PasswordHash();
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
