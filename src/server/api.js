import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'

const api = express.Router()

api.use(bodyParser.json())

function getToken(req) {
  var token = req.headers.authorization
  token = token && token.match(/Bearer ([^$]+)$/i)
  token = (token && token[1]) || null

  return token
}

api.use((req, res, next) => {
  var token = getToken(req)
  if (!token) {
    res.status(403).json({ message: 'No token provided' })
    return
  }

  next()
})

api.get('/', (req, res) => {
  res.send('Ok')
})

export default api;
