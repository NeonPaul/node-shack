<template>
<nav class="nav">
  <div class="nav-left">
    <b class="nav-item">The Glove Shack</b>
  </div>
  <div class="nav-right nav-menu" :class="{'is-active': navActive}">
    <div class="nav-item">
      <notifications></notifications>
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
</template>

<script>
import Auth from './auth.vue'
import {mapGetters, mapActions} from 'vuex'
import Vue from 'vue'
import {notifications, api} from './api'
import Editor from './components/Editor'
import Post from './components/Post'
import Notifications from './components/Notifications'

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
    Post,
    Notifications
  },
  computed: mapGetters(['user', 'posts']),
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
      }
    },
    mapActions(['loadPosts', 'post', 'postEdit'])
  )
}
</script>
