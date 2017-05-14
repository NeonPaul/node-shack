const { createBundleRenderer } = require('vue-server-renderer')
const clientManifest = require('./build/vue-ssr-client-manifest.json')
const serverBundle = require('./build/vue-ssr-server-bundle.json')
const template = require('fs').readFileSync(require.resolve('./index.template.html'), 'utf-8')
const renderer = createBundleRenderer(serverBundle, {
  template, // (optional) page template
  clientManifest // (optional) client build manifest
})
const express = require('express')
const server = express()
const cookieParser = require('cookie-parser')

server.use(cookieParser())

server.use(express.static(__dirname + '/build'))

server.post('/auth', (req, res) => {
  res.json({ token: 'asdfwj345rte' })
})

server.get('*', (req, res) => {
  const context = {
    title: 'hello',
    url: req.url,
    authToken: req.cookies.authToken
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        console.log(err)
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })
})

server.listen(8080)
