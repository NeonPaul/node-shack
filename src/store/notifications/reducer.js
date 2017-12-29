import { SUBSCRIBE } from "./actions";

export default function(state = { active: false }, action) {
  switch (action.type) {
    case SUBSCRIBE:
      return { active: true };
    default:
      return state;
  }
}
