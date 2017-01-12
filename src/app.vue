<template>
  <div>
    <auth v-if="!user" class="column is-half is-offset-one-quarter">

    </auth>
    <div v-else>
      <h1>Hi, {{user.user}}!</h1>
      <div class="columns">
        <div class="column is-11">
          <textarea></textarea>
        </div>
        <a class="column button is-primary is-medium"
           @click="addPost">Post</a>
      </div>
      <div v-for="post in posts" class="media">
        <figure class="media-left">
          <p class="image is-64x64">
            <img v-if="post.author" :src="post.author.avatar">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <strong>{{ post.author && post.author.user }}</strong><br>
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
import SimpleMDE from 'simplemde'
import Vue from 'vue'
import 'simplemde/dist/simplemde.min.css'

export default {
  data() {
    return { mde: null }
  },
  watch: {
    user(u) {
      if (u) {
        Vue.nextTick(() => {
          this.mde = new SimpleMDE()
        })
      }
    }
  },
  components: {
    Auth
  },
  computed: mapGetters(['user', 'posts']),
  methods: Object.assign(
    {
      addPost() {
        this.post(this.mde.value())
        this.mde.value('')
      }
    },
    mapActions(['loadPosts', 'post'])
  )
}
</script>

<style>
div .CodeMirror, div .CodeMirror-scroll {
  min-height:50px;
}
</style>
