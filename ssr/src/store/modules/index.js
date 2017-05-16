import alert from './alert'
import user from './user'
import _ from 'lodash'

const modules = {
  alert,
  user
}

export default modules
export const types = _.mapValues(modules, 'types')
