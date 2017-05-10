import basic from './basic'
import alert from './alert'
import jsonapi from './jsonapi'
import _ from 'lodash'

var modules = {
  user: basic('user'),
  alert
}

var jsonModules = {
  reactionTypes: jsonapi('reactionTypes')
}

export default modules
export { jsonModules }
export var types = Object.assign(
  _.mapValues(modules, 'types'),
  _.mapValues(jsonModules, 'types')
)
