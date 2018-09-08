// https://github.com/mozilla/serviceworker-cookbook/blob/master/push-subscription-management/index.js

// As subscription object is needed in few places let's create a method which
// returns a promise.
function getSubscription() {
  return navigator.serviceWorker.ready.then(function(registration) {
    return registration.pushManager.getSubscription();
  });
}

// Get the `registration` from service worker and create a new
// subscription using `registration.pushManager.subscribe`. Then
// register received new subscription by sending a POST request with its
// endpoint to the server.
export const subscribe = async registration => {
  if (!registration) {
    throw new Error('You have to register a service worker first');
  }
  const data = await registration.pushManager.subscribe({ userVisibleOnly: true });

  return fetch('/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      data: JSON.stringify(data)
    }),
    credentials: 'same-origin',
    redirect: 'follow'
  })
}

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

export default { subscribe, unsubscribe, getSubscription };
