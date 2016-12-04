import Vue from 'vue'
import App from './app.vue'
import store from './store'
import 'bulma/css/bulma.css'

var vm = new Vue(
  Vue.util.extend(
    { store },
    App
  )
)

vm.$mount('#app')
