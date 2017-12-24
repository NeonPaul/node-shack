const webpush = require("web-push");

const vapidKeys = {
  public: process.env.VAPID_PUBLIC,
  private: process.env.VAPID_PRIVATE
};

webpush.setVapidDetails(
  "mailto:neonpaul+push@gmail.com",
  vapidKeys.public,
  vapidKeys.private
);

module.exports = webpush;