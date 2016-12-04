import Vue from 'vue'
import App from './app.vue'
import store from './store'

try {
  require('bulma')
} catch (e) {
  console.error(e)
}

var vm = new Vue(
  Vue.util.extend(
    { store },
    App
  )
)

vm.$mount('#app')

require('bulma/css/bulma.css')
