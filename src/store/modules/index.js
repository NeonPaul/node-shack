import user from './user'
import alert from './alert'
import _ from 'lodash'

var modules = {
  user,
  alert
}

export default modules
export var types = _.mapValues(modules, 'types')
