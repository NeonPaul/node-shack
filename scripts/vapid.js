const webpush = require("web-push");

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

console.log("Public: ", vapidKeys.publicKey);
console.log("Private: ", vapidKeys.privateKey);
