<template>
  <textarea>{{value}}</textarea>
</template>

<script>
import SimpleMDE from 'simplemde'
import 'simplemde/dist/simplemde.min.css'

export default {
  props: ['value'],

  watch: {
    value(value) {
      if (this.mde && this.mde.value() !== value) {
        this.mde.value(value)
      }
    }
  },

  mounted() {
    this.mde = new SimpleMDE({
      element: this.$el,
      autosave: true,
      autofocus: true,
      indentWithTabs: false,
      status: false
    })

    this.mde.codemirror.on('change', () => {
      this.$emit('input', this.mde.value())
    })
  }
}
</script>
