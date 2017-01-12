<template>
  <div>
    <auth v-if="!user" class="column is-half is-offset-one-quarter">
    </auth>
    <div v-else>
      <div class="media">
        <figure class="media-left">
          <p class="image is-64x64">
            <img :src="user.avatar">
          </p>
        </figure>
        <div class="media-content">
          <strong>{{ user.user }}</strong>
          <textarea></textarea>
          <div>
            <a class="button is-primary is-medium"
               @click="addPost">Post</a>
          </div>
        </div>
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
            <span v-html="markdown(post.content)"
                  class="content box"></span>
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
import marked from 'marked'

export default {
  data() {
    return { mde: null }
  },
  watch: {
    user(u) {
      if (u) {
        Vue.nextTick(() => {
          this.mde = new SimpleMDE({
            autosave: true,
            autofocus: true,
            indentWithTabs: false,
            status: false
          })
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
      },
      markdown (content) {
        return marked(content)
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
