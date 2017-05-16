<template>
  <div><template v-if="available">
    Notifications:
    <input type="checkbox"
           :checked="subscribed"
           :disabled="!enabled"
           @change="change">
    <div v-if="!enabled">
     Notifications have been blocked. Please unblock them to use this feature.
    </div>
  </template>
  </div>
</template>

<script>
import {notifications, api} from '../api'

var serviceWorker = 'sw.js'

export default {
  data() {
    return  {
      loading: false,
      available: notifications.isAvailable,
      enabled: notifications.isEnabled(),
      subscribed: false
    }
  },

   created () {
      this.refreshData()
    },


  methods: {
    refreshData() {
      this.enabled = notifications.isEnabled()

      notifications.getSubscription().then(
        s => this.subscribed = !!s
      )
    },

    change() {
      if(this.subscribed) {
        this.subscribed = false
        notifications.getSubscription().then(
          s => s.unsubscribe()
        )
      } else {
        navigator.serviceWorker.register(serviceWorker)

        notifications.subscribe().then(
          s => api.createPush(s)
        ).then(s => {
            this.subscribed = true
        })
      }
    }
  }
}
</script>
