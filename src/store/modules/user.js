var types = {
  SET: 'user:SET'
}

export default {
  types,
  state: {
    value: null
  },
  getters: {
    user: state => state.value
  },
  mutations: {
    [types.SET]: function (state, value) {
      state.value = value
    }
  }
}
