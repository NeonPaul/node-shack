export default function(baseUrl) {
  return {
    authToken: null,

    setAuthToken(authToken) {
      this.authToken = authToken
    },

    fetch(path, options = {}) {
      var headers = (options.headers = options.headers || {})
      headers.Authorization = 'Bearer ' + this.authToken
      headers['Content-Type'] = 'application/vnd.api+json'
      return fetch(baseUrl + path, options).then(response => {
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
      })
    },

    readCurrentUser() {
      return this.fetch('/auth')
    }
  }
}
