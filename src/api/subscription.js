/*global self*/
import urlBase64ToUint8Array from '../push-utils'

function getServiceWorker () {
  return typeof navigator !== 'undefined'
    ? navigator.serviceWorker.ready
    : Promise.resolve(self.registration)
}

export default function notifications (key) {
  if (!key) {
    throw new TypeError('no key')
  }

  var options = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(key)
  }

  var isAvailable = typeof PushManager !== 'undefined'

  return {
    isAvailable,
    isEnabled: () => isAvailable && Notification.permission !== 'denied',
    getSubscription: () => getServiceWorker().then(sw => sw.pushManager.getSubscription()),
    subscribe: () => getServiceWorker().then(sw => sw.pushManager.subscribe(options))
  }
}
