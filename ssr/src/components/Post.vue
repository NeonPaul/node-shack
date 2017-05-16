<template>
<div class="media">
  <figure class="media-left">
    <p class="image is-64x64">
      <img v-if="post.author && post.author.avatar" :src="post.author.avatar">
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <strong>{{ post.author && post.author.user }}</strong><br>
      <div v-if="!editing" class="content box">
        <div v-html="contentHtml"></div>
        <button v-if="editable"
                @click='edit()'
                class="button is-small">Edit</button>
        <reactions :post-id="post.id"
                   :reactions="post.reactions"></reactions>
      </div>
      <div v-else>
        <editor v-model='newContent'></editor>
        <button @click='submitEdit'
                class="button is-primary">Save</button>
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
import Reactions from './Reactions'

export default {
  components: {
    Editor,
    Reactions
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
