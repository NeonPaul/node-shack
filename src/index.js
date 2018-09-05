import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main';
import Login from './components/login';

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

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      token: null
    };
  }

  render () {
    return <div>
      { this.state.token ? <Main user={user} posts={[post]} /> : <Login /> }
    </div>
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
