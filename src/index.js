import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main'

const user = {
  user: 'Paul'
}
const post = {
  author: {
    avatar: 'https://via.placeholder.com/100x100',
    user: 'Ross'
  },
  content: 'aaaaaa',
  id: '333',
  reactions: [{
    type: {
      icon: '+1',
      context: 'liked'
    },
    user: {
      user: 'Kate'
    }
  }]
}

ReactDOM.render(
  <div>
    <Main user={user} posts={[post]} />
  </div>,
  document.getElementById('root')
)
