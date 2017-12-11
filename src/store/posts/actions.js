import fetchPonyfill from "fetch-ponyfill";
import { getPosts } from "./selectors";
import { getToken } from "../";

const { fetch } = fetchPonyfill();
/* global BROWSER */

const prot = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const url = BROWSER ? "" : prot + "://" + host + ":" + port;

export const ADD_POSTS = "add posts";
export const UPDATE_POST = "update post";

export const addPosts = payload => ({ type: ADD_POSTS, payload });
export const updatePostOk = payload => ({ type: UPDATE_POST, payload });
export const fetchPosts = () => (dispatch, getState) =>
  fetch(url + "/api/posts/", {
    headers: {
      authorization: "Bearer " + getToken(getState())
    }
  })
    .then(res => res.json())
    .then(json => dispatch(addPosts(json)));
export const createPost = (content, headers) => (dispatch, getState) => {
  return fetch(url + "/api/posts", {
    headers: {
      ...headers,
      authorization: "Bearer " + getToken(getState()),
      "content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ content })
  })
    .then(res => {
      if ((res.status || res.statusCode) >= 400) {
        return res.text().then(t => {
          return JSON.parse(t);
        });
      } else {
        return res.json();
      }
    })
    .then(json => dispatch(addPosts([json, ...getPosts(getState())])));
};
export const updatePost = (id, content, headers = {}) => (dispatch, getState) =>
  fetch(url + "/api/posts/" + id, {
    headers: {
      ...headers,
      authorization: "Bearer " + getToken(getState()),
      "content-type": "application/json"
    },
    method: "MERGE",
    body: JSON.stringify({ content })
  })
    .then(res => res.json())
    .then(json => dispatch(updatePostOk(json)));
