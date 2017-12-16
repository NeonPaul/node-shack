import { SET_TYPES } from "./actions";

export default function(state = [], action) {
  switch (action.type) {
    case SET_TYPES:
      return action.payload;
    default:
      return state;
  }
}
