var Vuex = require('vuex')
var Vue = require('vue')

Vue.use(Vuex)

var store = module.exports = new Vuex.Store({
  actions: {}
})

var modules = {
  user: {
    state: 'None',
    getters:{
      user: state => state
    }
  }
}

for(let name of Object.keys(modules)){
  store.registerModule(name, modules[name])
}
