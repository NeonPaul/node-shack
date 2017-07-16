import React                from 'react'
import ReactDOM             from 'react-dom'

import Router               from 'universal-router'
import queryString          from 'query-string'


import App                  from './App'
import history              from './history'
import routes               from './pages/routes'

const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(x => x._insertCss())
    return () => { removeCss.forEach(f => f()) }
  },
}

const container = document.getElementById('root')
const router = new Router(routes, {
  resolveRoute: (context, params) => {
    if (typeof context.route.action !== 'function') {
      return null;
    }

    if (!context.route.public) {
      return routes.login.action(context, params)
    }

    return context.route.action(context, params);
  }
})

let currentLocation = history.location

async function onLocationChange(location, action) {
  currentLocation = location

  try {
    const route = await router.resolve({
      path: location.pathname,
      query: queryString.parse(location.search),
    })

    if (currentLocation.key !== location.key) return

    if (route.redirect) {
      history.replace(route.redirect)
      return
    }

    ReactDOM.render(
      <App context={ context }>{ route.component }</App>,
      container
    )
  } catch (error) {
    console.error(error)
  }
}

history.listen(onLocationChange)
onLocationChange(currentLocation)
