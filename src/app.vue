<template>
  <div>
    <auth v-if="!user" class="column is-half is-offset-one-quarter">

    </auth>
    <div v-else>
      <h1>Hi, {{user.user}}!</h1>
    </div>
  </div>
</template>

<script>
var Auth = require('./auth.vue')
var mapGetters = require('vuex').mapGetters

module.exports = {
  components: {
    Auth: Auth
  },
  computed: mapGetters(['user'])
}
</script>
