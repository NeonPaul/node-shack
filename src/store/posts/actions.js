import fetchPonyfill from 'fetch-ponyfill'

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
