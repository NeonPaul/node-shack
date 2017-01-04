import basic from './basic'
import alert from './alert'
import _ from 'lodash'

var modules = {
  user: basic('user'),
  posts: basic('posts'),
  alert
}

export default modules
export var types = _.mapValues(modules, 'types')
