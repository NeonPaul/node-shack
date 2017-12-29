import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import posts from "./posts/reducer";
import reactionTypes from "./reactions/reducer";
import notifications from "./notifications/reducer";
/* global BROWSER */
export const SET = payload => ({ type: SET, payload });

export const setToken = payload => ({ type: setToken, payload });

/**
 * This is a reducer, a pure function with (state, action) => state signature.
 * It describes how an action transforms the state into the next state.
 *
 * The shape of the state is up to you: it can be a primitive, an array, an object,
 * or even an Immutable.js data structure. The only important part is that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * In this example, we use a `switch` statement and strings, but you can use a helper that
 * follows a different convention (such as function maps) if it makes sense for your
 * project.
 */
function user(state = BROWSER ? window.initialState : {}, action) {
  switch (action.type) {
    case SET:
      state = Object.assign({}, state, { user: action.payload });
      break;
    case setToken:
      state = Object.assign({}, state, { token: action.payload });
      break;
    default:
      break;
  }

  return Object.assign({}, state, {
    posts: posts(state.posts, action),
    reactionTypes: reactionTypes(state.reactionTypes, action),
    notifications: notifications(state.notifications, action)
  });
}

export const getUser = state => state.user;
export const getToken = state => state.token;

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
export default () => createStore(user, applyMiddleware(thunk));
