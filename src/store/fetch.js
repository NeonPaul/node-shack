import fetchPonyfill from "fetch-ponyfill";
import { getToken } from ".";

const { fetch } = fetchPonyfill();
/* global BROWSER */

const prot = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const url = BROWSER ? "" : prot + "://" + host + ":" + port;

class FetchError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}

export default async (path, getState, { headers, body, ...options }) => {
  if (typeof body === "object") {
    body = JSON.stringify(body);
  }

  const res = await fetch(url + path, {
    ...options,
    headers: {
      ...headers,
      "content-type": "application/json",
      authorization: "Bearer " + getToken(getState())
    }
  });

  if (!res.ok) {
    throw new FetchError("Could not fetch " + path, res);
  }

  return res.json();
};
