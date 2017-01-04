<template>
  <div>
    <auth v-if="!user" class="column is-half is-offset-one-quarter">

    </auth>
    <div v-else>
      <h1>Hi, {{user.user}}!</h1>
      {{ posts }}
    </div>
  </div>
</template>

<script>
import Auth from './auth.vue'
import {mapGetters, mapActions} from 'vuex'

export default {
  components: {
    Auth
  },
  computed: mapGetters(['user', 'posts']),
  methods: mapActions(['loadPosts'])
}
</script>
