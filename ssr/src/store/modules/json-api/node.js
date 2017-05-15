export default function (ns, getKey) {
  const types = {
    SET: `${ns}:SET`
  }

  return {
    state: { value: null },
    types,
    mutations: {
      [types.SET] (state, records, record) {
        records[state.value] = record
        state.value = getKey(record)
      }
    },
    getters: {
      [ns] (state, records) {
        return records[state.value]
      }
    }
  }
}
