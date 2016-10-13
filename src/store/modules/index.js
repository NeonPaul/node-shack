var modules = {
  user: {
    state: {
      value: 'None'
    },
    getters:{
      user: state => state.value
    },
    types: {
      SET: 'user:SET'
    },
    mutations: {
    }
  }
}
modules.user.mutations[modules.user.types.SET] = function(state, value){
  state.value = value
}

module.exports.default = modules
module.exports.types = Object.keys(modules).reduce(function(types, key){
  types[key] = modules[key].types
  return types
}, {})
