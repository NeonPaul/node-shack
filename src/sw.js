/*global self, clients*/
import {notifications, api} from './api'

self.addEventListener('push', event => {
  event.waitUntil(self.registration.showNotification('New Gloveshack Post'))
})

self.addEventListener('pushsubscriptionchange', event => {
  event.waitUntil(
    notifications.subscribe().then(sub => api.createPush(sub))
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i]
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('https://shack-neonpaul.rhcloud.com/')
      }
    })
  )
})
