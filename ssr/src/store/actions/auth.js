import { types } from '../modules'
import auth from '../../api/auth'

const api = auth('http://localhost:8080')

export default {
  login ({ commit }, { email, password }) {
    api.requestToken({ email, password }).then(
      token => commit(types.alert.ERROR, token),
      err => commit(types.alert.ERROR, String(err))
    )
  },

  loginFb ({ commit }) {
    commit(types.alert.ERROR, 'Not implemented')
  }
}
