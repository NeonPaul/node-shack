import {auth as Auth} from './api'
import {types} from './modules'

var auth = Auth('/api/auth')

export default {
  login: function (store, payload) {
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
