import Api from './api'
import {types} from './modules'

var api = Api('/api')

export default {
  login: function (store, payload) {
    api.requestToken(payload)
    .then(token => {
      console.log(token)
      return api.verify(token)
    })
    .then(user => {
      store.commit(types.user.SET, user)
      store.dispatch('loadPosts')
    })
    .catch(e => {
      store.commit(types.alert.ERROR, e || 'Could not log in.')
    })
  },
  loadPosts: function (store, payload) {
    api.fetch('/posts').then(
      response => store.commit(types.posts.SET, response.data)
    )
  }
}
