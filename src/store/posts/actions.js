import fetchPonyfill from 'fetch-ponyfill'
import { getPosts } from './selectors'
import { getToken } from '../'

const { fetch } = fetchPonyfill()

const url = process.env.BROWSER ? '' : 'http://localhost:3000'

export const ADD_POSTS = 'add posts'

export const addPosts = (payload) => ({ type: ADD_POSTS, payload })
export const fetchPosts = () => (dispatch, getState) => fetch(url + '/api/posts/', {
  headers: {
    'authorization': 'Bearer ' + getToken(getState())
  }
}).then(res => res.json()).then(json => dispatch(addPosts(json)))
export const createPost = content => (dispatch, getState) => fetch(url + '/api/posts', {
  headers: {
    'authorization': 'Bearer ' + getToken(getState),
    'content-type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify({ content })
}).then(res => res.json()).then(json => dispatch(addPosts([json, ...getPosts(getState())])))
