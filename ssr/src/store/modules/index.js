import alert from './alert'
import _ from 'lodash'

const modules = {
  alert
}

export default modules
export const types = _.mapValues(modules, 'types')
