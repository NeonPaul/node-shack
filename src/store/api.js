import 'whatwg-fetch'
import fb from '../fb-api'

export default function (url) {
  return {
    setToken: function (token) {
      this.authToken = token
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
              return response.json()
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
    }
  }
}

