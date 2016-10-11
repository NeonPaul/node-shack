<template>
  <div>
    Current user: {{ user }}
  <form>
    Log in:<br>
    <label>Email: <input type="email"></label><br>
    <label>Password: <input type="password"></label>
  </form>
  </div>
</template>

<script>
var mapGetters = require('vuex').mapGetters
module.exports = {
  computed: mapGetters(['user'])
}
</script>
