import { subscribe } from './notifications';

self.addEventListener("push", event => {
  event.waitUntil(self.registration.showNotification("New Gloveshack Post"));
});

self.addEventListener("pushsubscriptionchange", async event => {
  // https://github.com/mozilla/serviceworker-cookbook/blob/master/push-subscription-management/service-worker.js
  event.waitUntil(() => subscribe(self.registration));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true
      })
      .then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            client.postMessage({});
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(
            self.location.protocol + self.location.host
          );
        }
      })
  );
});
