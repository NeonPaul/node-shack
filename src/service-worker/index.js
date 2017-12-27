/*global self, clients*/
//import fetch from '../store/fetch'

self.addEventListener("push", event => {
  event.waitUntil(self.registration.showNotification("New Gloveshack Post"));
});

self.addEventListener("pushsubscriptionchange", event => {
  // https://github.com/mozilla/serviceworker-cookbook/blob/master/push-subscription-management/service-worker.js
  //event.waitUntil(notifications.subscribe().then(sub => fetch));
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
          return clients.openWindow("http://gloveshack.herokuapp.com");
        }
      })
  );
});
