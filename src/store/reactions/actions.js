import fetchPonyfill from "fetch-ponyfill";
import { getToken } from "../";

const { fetch } = fetchPonyfill();
/* global BROWSER */

const prot = process.env.HTTPS === "true" ? "https" : "http";
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
const url = BROWSER ? "" : prot + "://" + host + ":" + port;

export const SET_TYPES = "set reaction types";

export const setReactionTypes = payload => ({ type: SET_TYPES, payload });
export const fetchReactionTypes = () => async (dispatch, getState) => {
  const res = await fetch(url + "/api/reactions/", {
    headers: {
      authorization: "Bearer " + getToken(getState())
    }
  });
  const txt = await res.text();
  const json = JSON.parse(txt);
  dispatch(setReactionTypes(json));
};
