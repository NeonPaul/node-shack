var api = require('./api')
var types = require('./modules').types

var auth = api.auth('/api/auth')

module.exports = {
  login: function(store, payload){
    auth.requestToken(payload)
    .then(token => {
      return auth.verify(token)
    })
    .then(user => {
      store.commit(types.user.SET, user)
    })
    .catch(() => {
      store.commit(types.alert.ERROR, 'Could not log in.')
    })
  }
}
