var express = require('express')
var fs = require('fs')
var path = require('path')

// Move dumpfile to dumpmodel.js
var dumpPath = path.resolve(__dirname, 'dumpfile')

var dumpfile = {
  read: () => new Promise((res, rej) => {
    fs.readFile(dumpPath, (er, contents) => {
      if (er && (er.code !== 'ENOENT')) {
        return rej(er)
      }

      res(contents || '')
    })
  }),
  write: data => new Promise((res, rej) =>  fs.writeFile(
    dumpPath,
    data,
    er => {
      if (er) {
        rj(er)
      } else {
        res()
      }
    }
  ))
}

var app = express()

function getBody (req) {
  return new Promise(resolve => {
    var body = ''
    req.on('data', data => body += data)
    req.on('end', () => resolve(body))
  })
}

//Move to dumpfile-resource.js
// Usage:
// switch req.method
// case GET: dumpfileRes.read
// case POST: dumpfileRes.write(req.body)
// return o => o(action)
function getResource () {
  return function (action, user) {
    if (action.name === 'GET') {
      return dumpfile.read()
    } else if (user && (action.name === 'POST')) {
      return dumpfile.write(action.payload)
    } else {
      return Promise.reject(new Error('Action ' + action.name + ' not allowed'))
    }
  }
}

// Move this to expressio.js
function getOutput (response) {
  return function (promise) {
    Promise.resolve(promise).then(
      value => response.send(value),
      error => response.status(400).send(error)
    )
  }
}

function i(req) {
  // Change to:
  // getDumpfileResource(user?)
  // switch on dumpfileResource
  return function (o) {
    getBody(req).then(body => {
      o(getResource()({
        name: req.method,
        payload: body
      }, req.user))
    })
  }
}

app.use('/', (req, res) => {
  i(req)(getOutput(res))
})

module.exports = app
