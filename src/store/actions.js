import Api from './api'
import {types} from './modules'

var api = Api('/api')

export default {
  login: function (store, payload) {
    api.requestToken(payload)
    .then(token => {
      return api.verify(token)
    })
    .then(user => {
      store.commit(types.user.SET, user)
      store.dispatch('loadPosts')
    })
    .catch(e => {
      store.commit(types.alert.ERROR, String(e) || 'Could not log in.')
    })
  },
  loadPosts: function (store, payload) {
    api.fetch('/posts').then(
      response => {
        store.commit('ADD_RECORDS', [
          ...response.data,
          ...response.included
        ])
        store.commit('SET_POSTS', response.data.map(post => post.id))
      }
    )
  }
}
