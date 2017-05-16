var types = {
  SET_USER: 'user:SET',
  UPDATE_USER: 'user:UPDATE'
}

export default {
  state: {
    user: null
  },
  getters: {
    user: state => state.user
  },
  types,
  mutations: {
    [SET_USER](state, user) {
      state.user = user
    },
    [UPDATE_USER](state, user) {
      if (user.id === state.user.id) {
        state.user = user
      }
    }
  }
}
