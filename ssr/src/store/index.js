// store.js
import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import actions from './actions'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    modules,
    actions
  })
}
