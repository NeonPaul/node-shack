import { subscribe } from './notifications';

self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});

self.addEventListener("push", event => {
  event.waitUntil(self.registration.showNotification("New Gloveshack Post"));
});

self.addEventListener("pushsubscriptionchange", event => {
  event.waitUntil(async () => {
    // https://github.com/mozilla/serviceworker-cookbook/blob/master/push-subscription-management/service-worker.js
    return subscribe(self.registration, event.oldSubscription && event.oldSubscription.options)
  });
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
