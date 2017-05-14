<template>
  <div class="notification" :class="'is-' + alert.type">
    {{ alert.message }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['alert'])
}
</script>
