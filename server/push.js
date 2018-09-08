const webpush = require("web-push");
const getenv = require("getenv");

const vapidKeys = {
  public: getenv("VAPID_PUBLIC", "BOr5nXHuCMzkuu90KInF1uGXZH4dE2JOg8AJXIGgLfMqflZqnPp238yysKfk4J7aBKLwRP96qPE-qc3Viaj5WMM"),
  private: getenv("VAPID_PRIVATE", "0ihIBgTOoac-fhjoCoIe3uDeqzr8nHhX9HBE8gQkLvI")
};

webpush.setVapidDetails(
  "mailto:neonpaul+push@gmail.com",
  vapidKeys.public,
  vapidKeys.private
);

module.exports = {
  webpush,
  vapidKeys
};
