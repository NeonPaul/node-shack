<template>
  <div>
    <auth v-if="!user" class="column is-half is-offset-one-quarter">
    </auth>
    <div v-else>
      <nav class="nav">
        <div class="nav-left">
          <b class="nav-item">The Glove Shack</b>
        </div>
        <div class="nav-right nav-menu" :class="{'is-active': navActive}">
          <div class="nav-item">
            <a class="button"
               v-if="notifications"
               @click="enableNote">Enable notifications</a>
          </div>
          <div class="nav-item">
            <p class="control has-addons">
              <input class="input " type="password" v-model="newPassword">
              <a class="button" @click="changePassword">Change password</a>
            </p>
          </div>
        </div>
        <span class="nav-toggle" @click="navActive = true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </nav>
      <div class="container">
        <div class="media">
          <figure class="media-left">
            <p class="image is-64x64">
              <img :src="user.avatar">
            </p>
          </figure>
          <div class="media-content">
            <strong>{{ user.user }}</strong>
            <editor v-model='newPost'></editor>
            <div>
              <a class="button is-primary is-medium"
                 @click="addPost">Post</a>
            </div>
          </div>
        </div>
        <post v-for="post in posts"
              :post="post"
              :editable="post.user_id === user.id"
              @edit="editPost(post.id, $event)">
        </post>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from './auth.vue'
import {mapGetters, mapActions} from 'vuex'
import Vue from 'vue'
import serviceWorker from 'file-loader?name=[name].[ext]!./sw.js'
import urlBase64ToUint8Array from './push-utils'
import {api} from './store/actions'
import Editor from './components/Editor'
import Post from './components/Post'

export default {
  data() {
    return {
      newPassword: '',
      navActive: false,
      newPost: ''
    }
  },
  components: {
    Auth,
    Editor,
    Post
  },
  computed: Object.assign({
      notifications: () => 'serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype
    },
    mapGetters(['user', 'posts'])
  ),
  methods: Object.assign(
    {
      addPost() {
        this.post(this.newPost)
        this.newPost = ''
      },
      editPost(id, content) {
        this.postEdit({
          id, content
        })
      },
      changePassword() {
        if (this.newPassword) {
          api.changePassword(this.newPassword)
            .then(
              () => alert('Password changed'),
              () => alert('Password could not be changed')
            )
          this.newPassword = ''
        }
      },
      enableNote() {
        console.log(process.env)
        navigator.serviceWorker.register(serviceWorker)
        navigator.serviceWorker.ready.then(
          registration => registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC)
          })
        ).then(
          subscription => api.createPush(subscription)
        ).catch(er => console.log(er))
      }
    },
    mapActions(['loadPosts', 'post', 'postEdit'])
  )
}
</script>

<style>
div .CodeMirror, div .CodeMirror-scroll {
  min-height:50px;
}
</style>
