import auth from './auth'
import json from './json-api'

export default {
  auth: auth('/'),
  json: json('/')
}
