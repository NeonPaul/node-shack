import Api from "../api";
import fetchPonyfill from "fetch-ponyfill";

const { fetch } = fetchPonyfill();
/* global BROWSER */

const prot = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const url = BROWSER ? "" : prot + "://" + host + ":" + port;

const api = new Api(url, fetch);

export default api;
