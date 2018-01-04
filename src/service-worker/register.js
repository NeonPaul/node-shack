import registerServiceWorker from '.';
// https://github.com/mozilla/serviceworker-cookbook/blob/master/push-subscription-management/index.js

// As subscription object is needed in few places let's create a method which
// returns a promise.
function getSubscription() {
  return navigator.serviceWorker.ready.then(function(registration) {
    return registration.pushManager.getSubscription();
  });
}

const register = async () => {
  // Register service worker and check the initial subscription state.
  await registerServiceWorker()

  return getSubscription();
};

// Get the `registration` from service worker and create a new
// subscription using `registration.pushManager.subscribe`. Then
// register received new subscription by sending a POST request with its
// endpoint to the server.
export const subscribe = () => {
  register();
  return navigator.serviceWorker.ready.then(function(registration) {
    return registration.pushManager.subscribe({ userVisibleOnly: true });
  });
};

// Get existing subscription from service worker, unsubscribe
// (`subscription.unsubscribe()`) and unregister it in the server with
// a POST request to stop sending push messages to
// unexisting endpoint.
export const unsubscribe = () => {
  return getSubscription().then(function(subscription) {
    subscription.unsubscribe();
    return subscription;
  });
};
