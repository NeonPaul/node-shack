import fetch from 'isomorphic-fetch'

export default baseUrl => ({
  post: function (url, payload) {
    return fetch(baseUrl + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => {
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
  requestToken: function (credentials) {
    return this.post('/auth', credentials)
    .then(response => {
      return response.token
    })
  }
})
