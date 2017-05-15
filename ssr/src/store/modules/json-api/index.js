import node from './node'
import mapValues from 'lodash/mapValues'

export default function (store) {
  const modules = {
    user: node('user', r => r.type + r.id)
  }

  const keys = Object.keys(modules)
  const pluck = (field, initial) =>
    keys.reduce(
      (obj, key) => Object.assign(modules[key][field], obj),
      initial || {}
   )

  const types = pluck('types')

  return {
    types,
    state: pluck(
      'state',
      {
        records: {}
      }
    ),
    methods: keys.reduce(
      (methods, key) =>
        Object.assign(
          methods,
          mapValues(modules[key].methods, (k, fn) =>
            (state, payload) => {
              fn(state[key], state.records, payload)
            }
          )
        ),
      {}
    ),
    getters: mapValues(
      modules,
      (k, v) =>
        state => v[k](state[k], state.records))
  }
}
