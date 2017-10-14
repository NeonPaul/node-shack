import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import queryString from 'query-string'

import App from './App'
import history from './history'
import router from './router'
import store from './store'
import { getUser } from './store'

const context = {
  insertCss: (...styles) => {
    const removeCss = styles.map(x => x._insertCss())
    return () => { removeCss.forEach(f => f()) }
  }
}

const container = document.getElementById('root')

let currentLocation = history.location

async function onLocationChange (location, action, state) {
  currentLocation = location

  try {
    const route = await router.resolve({
      path: location.pathname,
      query: queryString.parse(location.search),
      user: getUser(store.getState()),
      store,
      method: state && state.method,
      body: state && state.body
    })

    if (currentLocation.key !== location.key) return

    if (route.redirect) {
      history.replace(route.redirect)
      return
    }

    const Route = route.component
    ReactDOM.render(
      <Provider store={store}>
        <App context={context}><Route /></App>
      </Provider>,
      container
    )
  } catch (error) {
    console.error(error)
  }
}

let user = getUser(store.getState())

history.listen(onLocationChange)
store.subscribe(() => {
  const nextUser = getUser(store.getState())
  if (nextUser !== user) {
    user = nextUser
    onLocationChange(history.location, history.action, history.location.state)
  }
})
onLocationChange(currentLocation)
