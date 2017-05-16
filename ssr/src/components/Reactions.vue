<template>
  <div>
    <button v-for="type in reactionTypes"
            class="button is-small"
            @click="react(type)">{{ type.icon }} {{ type.verb }}</button>
    <div v-for="reaction in reactions">
      {{ reaction.type.icon }} {{ reaction.user.user }} {{ reaction.type.context }} this post.
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: ['postId', 'reactions'],

  methods: Object.assign(
    {
      react(type) {
        this.addReaction({ postId: this.postId, type: type.id })
      }
    },
    mapActions(['addReaction'])
  ),

  computed: mapGetters(['reactionTypes'])
}
</script>
