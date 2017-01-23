import 'whatwg-fetch'
import fb from '../fb-api'

export default function (url) {
  var token = window.localStorage && localStorage.getItem('authToken')

  return {
    authToken: token,
    setToken: function (token) {
      this.authToken = token
      if (window.localStorage) {
        localStorage.setItem('authToken', token)
      }
    },
    fetch: function (path, options = {}) {
      var headers = options.headers = options.headers || {}
      headers.Authorization = 'Bearer ' + this.authToken
      headers['Content-Type'] = 'application/vnd.api+json'
      return window.fetch(url + path, options)
            .then(response => {
              if (response.status >= 400) {
                throw new Error('Something bad happened')
              }
              if (response.status !== 204) {
                return response.json()
              }
            })
    },
    verify: function (token) {
      this.setToken(token)
      return this.fetch('/auth')
        .then(function (json) {
          return json.data
        })
    },
    requestTokenFb: function () {
      return fb.login()
        .then(result =>
          window.fetch(url + '/auth/facebook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(result.authResponse)
          })
          .then(response => response.json())
          .then(response => {
            this.setToken(response.token)
            return response.token
          })
        )
    },
    requestToken: function (credentials) {
      return window.fetch(url + '/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error('Something bad happened')
        }

        return response.json()
      })
      .then(response => {
        this.setToken(response.token)
        return response.token
      })
    },
    changePassword: function (password) {
      return this.fetch('/password', {
        method: 'PUT',
        body: JSON.stringify({
          password
        })
      })
    },
    createPush: function (subscription) {
      return Promise.all([
        this.fetch('/channels', {
          method: 'POST',
          body: JSON.stringify({
            data: {
              type: 'channel',
              attributes: {
                data: subscription
              }
            }
          })
        }),
        this.fetch('/subscriptions', {
          method: 'POST',
          body: JSON.stringify({
            data: {
              type: 'subscription',
              attributes: {
                type: 'post'
              }
            }
          })
        })
      ])
    }
  }
}
