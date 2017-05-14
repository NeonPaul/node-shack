<template>
  <div id="app">
    <router-view v-if="authToken"></router-view>
    <login class="column is-half is-offset-one-quarter" v-else></login>
  </div>
</template>

<script>
import Login from './components/Login'
export default {
  components: {
    Login
  },
  props: ['authToken']
}
</script>
