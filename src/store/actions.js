import {api} from '../api'
import {types} from './modules'

function key (record) {
  return record.type + record.id
}

export {key}

export default {
  loginFb: function (store) {
    return api.requestTokenFb()
    .then(token => store.dispatch('verifyLogin', token))
    .catch(e => {
      store.commit(types.alert.ERROR, String(e) || 'Could not log in via facebook.')
    })
  },
  login: function (store, payload) {
    return api.requestToken(payload)
    .then(token => store.dispatch('verifyLogin', token))
  },
  verifyLogin: (store, token) => {
    return api.verify(token)
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
        store.commit('SET_POSTS', response.data.map(post => key(post)))
      }
    )
  },
  postEdit: function (store, payload) {
    api.update('post')
      .set('content', payload.content)
      .on(payload.id)()
      .then(
        record => {
          store.commit('ADD_RECORDS', [record])
        }
      )
  },
  post: function (store, payload) {
    api.fetch('/posts', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'post',
          attributes: {
            content: payload
          }
        }
      })
    }).then(
      response => {
        store.commit('ADD_RECORDS', response.included)
        store.commit('ADD_RECORDS', [response.data])
        store.commit('ADD_POST', key(response.data))
      }
    )
  }
}
