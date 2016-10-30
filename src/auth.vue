<template>
  <div>
    <h1>Log in</h1>
    <div v-if="alert.message" class="notification" :class="'is-' + alert.type">
      {{ alert.message }}
    </div>
    <form @submit.prevent="login({ email: email, password: password })">
      <p class="control">
        <input class="input"
               name="email"
               type="email"
               v-model="email"
               placeholder="Email"
               autofocus>
      </p>
      <p class="control">
        <input class="input"
               type="password"
               v-model="password"
               placeholder="Password"
               name="password">
      </p>
      <p class="control">
        <button type="submit" class="button is-primary">Login</button>
      </p>
    </form>
  </div>
</template>

<script>
var mapGetters = require('vuex').mapGetters
var mapActions = require('vuex').mapActions
module.exports = {
  data: function(){
    return {
      email: '',
      password: ''
    }
  },
  computed: mapGetters(['alert']),
  methods: mapActions(['login'])
}
</script>
