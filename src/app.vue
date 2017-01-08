<template>
  <div>
    <auth v-if="!user" class="column is-half is-offset-one-quarter">

    </auth>
    <div v-else>
      <h1>Hi, {{user.user}}!</h1>
      <div v-for="post in posts" class="media">
        <figure class="media-left">
          <p class="image is-64x64">
            <img :src="post.author.avatar">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <strong>{{ post.author.user }}</strong><br>
            {{ post.content }}
          </div>
        </div>
      </div>
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
