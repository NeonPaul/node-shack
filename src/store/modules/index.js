var modules = {
  user: {
    state: {
      value: null
    },
    getters: {
      user: state => state.value
    },
    types: {
      SET: 'user:SET'
    },
    mutations: {
    }
  },
  alert: {
    state: {
      message: null,
      type: null
    },
    getters: {
      alert: state => state
    },
    types: {
      ERROR: 'alert:ERROR'
    },
    mutations: {
    }
  }
}
modules.user.mutations[modules.user.types.SET] = function (state, value) {
  state.value = value
}
modules.alert.mutations[modules.alert.types.ERROR] = function (state, value) {
  state.message = value
  state.type = 'danger'
}

module.exports.default = modules
module.exports.types = Object.keys(modules).reduce(function (types, key) {
  types[key] = modules[key].types
  return types
}, {})
