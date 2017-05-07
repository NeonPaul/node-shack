import Vuex from 'vuex'
import Vue from 'vue'
import modules from './modules'
import actions, {key} from './actions'
import {api} from '../api'
import _ from 'lodash'

Vue.use(Vuex)

function to (items, mapper) {
  if (Array.isArray(items)) {
    return items.map(mapper)
  }

  if (items) {
    return mapper(items)
  }
}

function expand (record, records) {
  var linked = _.mapValues(
    record.relationships,
    rel => to(
      rel.data,
      link => expand(records[key(link)], records)
    )
  )

  return Object.assign({
       id: record.id,
       type: record.type
      },
      record.attributes,
      linked
    )
}

var store = module.exports = new Vuex.Store({
  actions,
  state: {
    records: {},
    posts: []
  },
  getters: {
    posts: state => state.posts.map(
      post => expand(state.records[post], state.records)
    )
  },
  mutations: {
    ADD_RECORDS: (state, payload) => {
      var records = Object.assign({}, state.records)
      payload.forEach(record => records[key(record)] = record)
      state.records = records
    },
    SET_POSTS: (state, payload) =>
      state.posts = payload,
    ADD_POST: (state, payload) =>
      state.posts.splice(0, 0, payload)
  }
})

_.forEach(modules, (value, key) => store.registerModule(key, value))

if (api.authToken) {
  store.dispatch('verifyLogin', api.authToken)
}
