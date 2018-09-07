//import api from "../api";
import localForage from "localforage";

self.addEventListener("push", event => {
  event.waitUntil(self.registration.showNotification("New Gloveshack Post"));
});

self.addEventListener("pushsubscriptionchange", event => {
  const token = localForage.getItem("authToken");
  api.setToken(token);

  // https://github.com/mozilla/serviceworker-cookbook/blob/master/push-subscription-management/service-worker.js
  event.waitUntil(async () => {
    const data = await self.registration.pushManager.subscribe({
      userVisibleOnly: true
    });

    //await api.notifications.create(data);
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
