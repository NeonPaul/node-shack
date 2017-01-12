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
    <b>OR</b><br>
    <a class="button is-secondary" @click="loginFb">Log in with Facebook</a>
  </div>
</template>

<script>
import {mapGetters, mapActions } from 'vuex'

module.exports = {
  data: function(){
    return {
      email: '',
      password: ''
    }
  },
  computed: mapGetters(['alert']),
  methods: mapActions(['login', 'loginFb'])
}
</script>
