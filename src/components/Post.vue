<template>
<div class="media">
  <figure class="media-left">
    <p class="image is-64x64">
      <img v-if="post.author" :src="post.author.avatar">
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <strong>{{ post.author && post.author.user }}</strong><br>
      <div v-if="!editing">
        <div v-html="contentHtml"
              class="content box"></div>
        <button v-if="editable" @click='edit()'>Edit</button>
      </div>
      <div v-else>
        <editor v-model='newContent'></editor>
        <button @click='submitEdit'>Ok</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'
import marked from 'marked'
import Editor from './Editor'

export default {
  components: {
    Editor
  },
  
  data : () => ({
    editing: false,
    newContent: ''
  }),

  props: ['post', 'editable'],

  methods: {
    edit () {
      this.newContent = this.post.content
      this.editing = true
    },

    submitEdit () {
      this.$emit('edit', this.newContent)
      this.editing = false
      this.newContent = ''
    }
  },

  computed: {
    contentHtml() {
      return marked(this.post.content)
    }
  }
}
</script>
