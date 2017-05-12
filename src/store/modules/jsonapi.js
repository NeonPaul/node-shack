export default function(namespace) {
  var types = {
    SET: namespace + ':SET'
  }

  var fn = (getKey, getRecord) => {
    return {
      types,
      state: [],
      getters: {
        [namespace]: state => state.map(getRecord)
      },
      mutations: {
        [types.SET]: function(state, records) {
          state.splice(0, Infinity, ...records.map(getKey))
        }
      }
    }
  }

  fn.types = types

  return fn
}
