var types = {
  ERROR: 'alert:ERROR'
}

export default {
  state: {
    message: null,
    type: null
  },
  getters: {
    alert: state => state
  },
  types,
  mutations: {
    [types.ERROR]: function (state, value) {
      state.message = value
      state.type = 'danger'
    }
  }
}
