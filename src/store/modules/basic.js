export default function (namespace) {
  var types = {
    SET: namespace + ':SET'
  }

  return {
    types,
    state: {
      value: null
    },
    getters: {
      [namespace]: state => state.value
    },
    mutations: {
      [types.SET]: function (state, value) {
        state.value = value
      }
    }
  }
}
