import Vuex from 'vuex'
import Vue from 'vue'
import modules, { jsonModules } from './modules'
import actions from './actions'
import { api } from '../api'
import _ from 'lodash'
import expand from './expand'

function getKey(record) {
  return record.type + record.id
}

Vue.use(Vuex)

var store = (module.exports = new Vuex.Store({
  actions,
  state: {
    records: {},
    posts: []
  },
  getters: {
    posts: state => {
      return state.posts.map(hydrate)
    }
  },
  mutations: {
    ADD_RECORDS: (state, payload) => {
      var records = Object.assign({}, state.records)
      payload.forEach(record => (records[getKey(record)] = record))
      state.records = records
    },
    SET_POSTS: (state, payload) => (state.posts = payload),
    ADD_POST: (state, payload) => state.posts.splice(0, 0, payload)
  }
}))

var hydrate = expand(getKey, key => store.state.records[key])

_.forEach(modules, (value, key) => store.registerModule(key, value))
_.forEach(jsonModules, (value, key) =>
  store.registerModule(key, value(getKey, hydrate))
)

if (api.authToken) {
  store.dispatch('verifyLogin', api.authToken)
}

navigator.serviceWorker &&
  navigator.serviceWorker.addEventListener('message', () =>
    store.dispatch('loadPosts')
  )

export { hydrate, getKey }
