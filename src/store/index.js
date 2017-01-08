import Vuex from 'vuex'
import Vue from 'vue'
import modules from './modules'
import actions from './actions'
import _ from 'lodash'

Vue.use(Vuex)

function to (items, mapper) {
  if (Array.isArray(items)) {
    return items.map(mapper)
  } else {
    return mapper(items)
  }
}

function expand (record, records) {
  var linked = _.mapValues(
    record.relationships,
    rel => to(
      rel.data,
      link => expand(records[link.id], records)
    )
  )

  return Object.assign({
       id: record.id
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
      payload.forEach(record => records[record.id] = record)
      state.records = records
    },
    SET_POSTS: (state, payload) =>
      state.posts = payload
  }
})

_.forEach(modules, (value, key) => store.registerModule(key, value))
