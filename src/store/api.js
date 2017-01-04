import 'whatwg-fetch'

export default function (url) {
  return {
    setToken: function (token) {
      this.authToken = token
    },
    fetch: function (path, options = {}) {
      var headers = options.headers = options.headers || {}
      headers.Authorization = 'Bearer ' + this.authToken
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

