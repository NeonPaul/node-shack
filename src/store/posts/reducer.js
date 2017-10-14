import { ADD_POSTS } from './actions'

export default function (state = {}, action) {
  switch (action.type) {
    case ADD_POSTS:
      return action.payload
    default:
      return state
  }
}
