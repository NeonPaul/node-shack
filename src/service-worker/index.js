import notifications from './notifications';
import registerServiceWorker from './service-worker';

export const subscribe = async () => {
  // TODO: Should we be waiting for `naviagator.serviceWorker.ready` before subscribing?
  return notifications.subscribe(await registerServiceWorker());
}
