<template>
  <div>
    Current user: {{ user }}

    Log in:<br>
    <label>Email: <input type="email" v-model="email"></label><br>
    <label>Password: <input type="password" v-model="password"></label><br>
    <button @click="login({ email: email, password: password })">
      Login
    </button>
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
  computed: mapGetters(['user']),
  methods: mapActions(['login'])
}
</script>
