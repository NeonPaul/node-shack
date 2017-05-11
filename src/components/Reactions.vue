<template>
  <div>
    <button v-for="type in reactionTypes"
            @click="react(type)">{{ type.icon }}</button>
    <div v-for="reaction in reactions">
      {{ reaction.user.user }} {{ reaction.type.context }} this post.
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
