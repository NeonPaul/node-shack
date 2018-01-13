class FetchError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}

class Notifications {
  constructor(api) {
    this.api = api;
  }

  create(data) {
    return this.api.fetch("/api/channels/", {
      method: "POST",
      body: { data }
    });
  }
}

class Api {
  constructor(root, originalFetch = fetch) {
    this.root = root;
    this.originalFetch = originalFetch;
    this.notifications = new Notifications(this);
  }

  setToken(token) {
    this.token = token;
  }

  async fetch(path, { headers, body, ...options }) {
    if (typeof body === "object") {
      body = JSON.stringify(body);
    }

    const res = await this.originalFetch(this.root + path, {
      ...options,
      headers: {
        ...headers,
        "content-type": "application/json",
        authorization: "Bearer " + this.token
      },
      body
    });

    if (!res.ok) {
      throw new FetchError("Could not fetch " + path, res);
    }

    return res.json();
  }
}

export default Api;
