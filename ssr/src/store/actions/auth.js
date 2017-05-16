import { types } from '../modules'
import api from '../../api'

export default {
  login({ commit }, { email, password }) {
    api.auth
      .requestToken({ email, password })
      .then(token => (api.json.setToken(token), api.json.getCurrentUser()))
      .then(({ data }) => commit(types.user.SET_USER, data.user))
      .catch(err => commit(types.alert.ERROR, String(err)))
  },

  loginFb({ commit }) {
    commit(types.alert.ERROR, 'Not implemented')
  }
}
