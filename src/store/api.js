import 'whatwg-fetch'
import fb from '../fb-api'

function processFetch(response) {
  if (response.status >= 400) {
    return response
      .text()
      .catch(() => 'HTTP status ' + response.status)
      .then(text => {
        throw new Error(text)
      })
  }
  if (response.status !== 204) {
    return response.json()
  }
}

export default function(url) {
  var localStorage = typeof window !== 'undefined' && window.localStorage
  var token = localStorage && localStorage.getItem('authToken')

  return {
    authToken: token,
    setToken: function(token) {
      this.authToken = token
      if (localStorage) {
        localStorage.setItem('authToken', token)
      }
    },
    fetch: function(path, options = {}) {
      var headers = (options.headers = options.headers || {})
      headers.Authorization = 'Bearer ' + this.authToken
      headers['Content-Type'] = 'application/vnd.api+json'
      return fetch(url + path, options).then(processFetch)
    },
    verify: function(token) {
      this.setToken(token)
      return this.fetch('/auth').then(function(json) {
        return json.data
      })
    },
    requestTokenFb: function() {
      return fb.login().then(result =>
        window
          .fetch(url + '/auth/facebook', {
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
    requestToken: function(credentials) {
      return window
        .fetch(url + '/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
        .then(processFetch)
        .then(response => {
          this.setToken(response.token)
          return response.token
        })
    },
    changePassword: function(password) {
      return this.fetch('/password', {
        method: 'PUT',
        body: JSON.stringify({
          password
        })
      })
    },
    createPush: function(subscription) {
      return Promise.all([
        this.postPayload('/channels', 'channel', {
          data: subscription
        }),
        this.postPayload('/subscriptions', 'subscription', {
          type: 'post'
        })
      ])
    },

    postPayload(url, model, payload) {
      return this.fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: model,
            attributes: payload
          }
        })
      }).then(response => response.data)
    },

    create(model) {
      var payload = {}
      var exec = Object.assign(
        () => this.postPayload('/' + model, model, payload),
        {
          with: arg => ((payload = arg), exec)
        }
      )
      return exec
    },

    update(model) {
      var id
      var attributes = {}
      var exec = Object.assign(
        () => this.postPayload('/' + model + '/' + id, model, payload),
        {
          set(attrs, value) {
            if (typeof attrs !== 'object') {
              attrs = {
                [attrs]: value
              }
            }
            Object.assign(attributes, attrs)
            return exec
          },

          on(onId) {
            id = onId
            return exec
          }
        }
      )
      return exec
    }
  }
}
