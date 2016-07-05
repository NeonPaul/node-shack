module.exports = function(resource, req, res){
  var token = req.headers['Authorization'];
  token = token && token.match(/Bearer ([^$]+)$/i)
  token = token && token[1] || null;

  var request = {
    resource,
    method: req.method
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(request, null, 4));

  /*
   * If resource === auth
   *   switch(method){
   *     case 'POST':
   *       // Lookup user
   *       // Create token if found
   *       // Return with 201
   *       // else return with 401
   *       break;
   *     case 'GET':
   *       // Validate token and return user with 200
   *       // else return with 401
   *       break;
   *     default:
   *       // send 405 method not allowed
   *   }
   *
   * 
   */
}
