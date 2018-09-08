import notifications from './notifications';
import registerServiceWorker from './service-worker';

const subCallbacks = [];
subCallbacks.call = function (arg) {
  this.forEach(c => c(arg));
}

export const subscribe = async () => {
  const n = notifications.subscribe(await registerServiceWorker());
  subCallbacks.call(true);
  return n;
}

export const unsubscribe = async () => {
  const n = notifications.unsubscribe();
  subCallbacks.call(false);
  return n;
}

export const getSubscription = async () =>
  typeof 'navigator' !== 'undefined' &&
  navigator.serviceWorker &&
  (await navigator.serviceWorker.ready).pushManager.getSubscription();

export const onSubscriptionChange = async (callback) => {
  callback(!!await getSubscription());
  subCallbacks.push(callback);
}
