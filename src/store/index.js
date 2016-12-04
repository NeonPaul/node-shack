import Vuex from 'vuex'
import Vue from 'vue'
import modules from './modules'
import actions from './actions'
import _ from 'lodash'

Vue.use(Vuex)

var store = module.exports = new Vuex.Store({
  actions
})

_.forEach(modules, (value, key) => store.registerModule(key, value))
