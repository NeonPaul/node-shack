export default function(namespace) {
  return (getKey, getRecord) => {
    var types = {
      SET: namespace + ':SET'
    }

    return {
      types,
      state: [],
      getters: {
        [namespace]: state => state.map(getRecord)
      },
      mutations: {
        [types.SET]: function(state, records) {
          state.splice(0, Infinity, records)
        }
      }
    }
  }
}
