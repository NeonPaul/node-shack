import { ADD_POSTS, UPDATE_POST } from './actions'

export default function (state = [], action) {
  switch (action.type) {
    case ADD_POSTS:
      return action.payload
    case UPDATE_POST:
      return state.map(post => post.id === action.payload.id ? action.payload : post)
    default:
      return state
  }
}
