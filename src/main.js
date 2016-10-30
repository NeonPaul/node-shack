var Vue = require('vue')
var App = require('./app.vue')
var store = require('./store')
require('bulma/bulma.sass')

var vm = new Vue(
  Vue.util.extend(
    { store: store },
    App
  )
)

vm.$mount('#app')
