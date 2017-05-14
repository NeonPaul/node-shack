// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: require('./components/Index.vue') },
      { path: '/item/:id', component: require('./components/Item.vue') }
    ]
  })
}
