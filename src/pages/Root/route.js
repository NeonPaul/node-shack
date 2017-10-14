import Root from './Root'
import { fetchPosts } from '../../store/posts/actions'

const title = `Root`

export default {
  path: '/',

  action (...args) {
    return {
      title,
      component: Root,
      action (method, data) {
        return fetchPosts()
      }
    }
  }
}
