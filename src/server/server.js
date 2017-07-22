import bodyParser           from 'body-parser'
import cookieParser         from 'cookie-parser'
import express              from 'express'
import { createServer }     from 'http'

import fs                   from 'fs'

import Router               from 'universal-router'

import App                  from '../App'
import Html                 from '../components/Html'
import router               from '../router'

import React                from 'react'
import ReactDOM             from 'react-dom/server'
import auth from './auth'

const PORT = 3000

const app = express()
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
auth(app)
const server = createServer(app)

const jsFiles = fs.readdirSync('./build/static/js')

app.use(express.static('./build'))

app.use(bodyParser.json())

app.get('*', async (req, res, next) => {
  try {
    const css = new Set()

    const context = {
      insertCss: (...styles) => {
        styles.forEach(style => {
          return css.add(style._getCss())
        })
      },
    }

    const route = await router.resolve({
      path: req.path,
      query: req.query,
      user: req.user
    })

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect)
      return
    }

    const data = { ...route }
    data.children = ReactDOM.renderToString(<App context={ context }>{ route.component }</App>)
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ]
    data.scripts = [
      `/static/js/${ jsFiles[0] }`
    ]
    data.user = req.user

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)
    res.status(route.status || 200)
    res.send(`<!doctype html>${html}`)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500)
  res.send(`Internal server error`)
})

server.listen(PORT, () => {
  console.log(`==> 🌎  http://0.0.0.0:${ PORT }/`)
})
