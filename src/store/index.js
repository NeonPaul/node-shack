var Vuex = require('vuex')
var Vue = require('vue')
var modules = require('./modules').default
var actions = require('./actions')

Vue.use(Vuex)

var store = module.exports = new Vuex.Store({
  actions: actions
})

for(let name of Object.keys(modules)){
  store.registerModule(name, modules[name])
}
