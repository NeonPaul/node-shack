import 'whatwg-fetch'

export var auth = function (url) {
  return {
    verify: function (token) {
      return window.fetch(url, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      .then(function (response) {
        if (response.status >= 400) {
          throw new Error('Something bad happened')
        }

        return response.json()
      })
      .then(function (json) {
        return json.data
      })
    },
    requestToken: function (credentials) {
      return window.fetch(url, {
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
      .then(function (response) {
        return response.token
      })
    }
  }
}
